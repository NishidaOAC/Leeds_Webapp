// 🟢 ADD THIS AT THE VERY TOP OF expiryNotifier.job.js
const cron = require('node-cron');
const axios = require('axios');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Supplier } = require('../models');

// Rest of your checkExpiringSuppliers function code...



const checkExpiringSuppliers = async (targetSupplierId = null) => {
    console.log("==========================================");
    console.log(`[EXPIRY JOB] Running Supplier Expiry Check... ${targetSupplierId ? `(Target ID: ${targetSupplierId})` : '(Scheduled Scan)'}`);

    try {
        let whereClause = {};

        if (targetSupplierId) {
            whereClause = { id: targetSupplierId };
        } else {
            // 🟢 CHANGED: Fetch everything up to 10 days in the future (includes ALL past expired dates)
            const endDate = moment().add(10, 'days').endOf('day').toDate();
            whereClause = {
                expiryDate: {
                    [Op.lte]: endDate // Changed Op.between to Op.lte
                }
            };
        }

        const expiringSuppliers = await Supplier.findAll({ where: whereClause });

        if (expiringSuppliers.length === 0) {
            console.log("[EXPIRY JOB] No expired or expiring suppliers found.");
            console.log("==========================================");
            return;
        }

        const systemToken = jwt.sign(
            { id: 6, role: 'SYSTEM' }, 
            process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '15m' }
        );

        const authBaseUrl = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3000/api/auth';

        for (const supplier of expiringSuppliers) {
            const recipientId = supplier.addedBy;
            if (!recipientId) continue;

            const formattedDate = moment(supplier.expiryDate).format('DD-MM-YYYY');
            const supplierRegNo = supplier.internalSupplierNumber;
            
            // 🟢 CHANGED: Dynamic message based on whether date is past or future
            const isPast = moment(supplier.expiryDate).isBefore(moment(), 'day');
            const notificationMessage = isPast
                ? `Supplier '${supplier.name}' (${supplierRegNo}) has expired on ${formattedDate}.`
                : `Supplier '${supplier.name}' (${supplierRegNo}) is expiring on ${formattedDate}.`;

            let isDuplicate = false;

            try {
                const response = await axios.get(`${authBaseUrl}/notification?userId=${recipientId}`, {
                    headers: { Authorization: `Bearer ${systemToken}` }
                });

                const existingNotifs = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data?.data || response.data?.notifications || []);

                if (!targetSupplierId) {
                    isDuplicate = existingNotifs.some(n => {
                        if (!n.message) return false;
                        return n.message.includes(`(${supplierRegNo})`);
                    });
                }

            } catch (checkErr) {
                console.warn(`[EXPIRY JOB] Could not query notifications: ${checkErr.message}`);
            }

            if (isDuplicate) {
                console.log(`[EXPIRY JOB] ⚠️ Skipping Supplier Reg No '${supplierRegNo}': Notification already exists.`);
                continue;
            }

            const payload = {
                userId: recipientId,
                message: notificationMessage,
                isRead: false,
                route: '/dashboard'
            };

            try {
                await axios.post(`${authBaseUrl}/notification/create`, payload, {
                    headers: { Authorization: `Bearer ${systemToken}` }
                });
                console.log(`[EXPIRY JOB] ✅ Notification Created for Supplier Reg No '${supplierRegNo}'`);
            } catch (apiErr) {
                console.error(`[EXPIRY JOB] ❌ Axios Request Failed:`, apiErr.response?.data || apiErr.message);
            }
        }
    } catch (error) {
        console.error('[EXPIRY JOB] ❌ DB Error:', error.message);
    }
    console.log("==========================================");
};

// 🟢 FIXED CODE at the bottom of expiryNotifier.job.js:
const initExpiryJob = () => {
    cron.schedule('0 0 * * *', () => checkExpiringSuppliers());
};

module.exports = { 
    checkExpiringSuppliers, 
    initExpiryJob 
};