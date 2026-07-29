const Company = require("../models/company");
const { Op, sequelize } = require('sequelize');
const axios = require('axios');


exports.getSuppliersWithQualification = async (req, res) => {
  try {
    // 1. Fetch companies flagged as suppliers in Invoice Service DB
    const invoiceCompanies = await Company.findAll({ where: { supplier: true } });

    // 2. Fetch suppliers with valid dates from Supplier Microservice
    let qualifiedSuppliers = [];
    try {
      const supplierServiceUrl = process.env.SUPPLIER_SERVICE_URL || 'http://localhost:3000';
      const supplierServiceRes = await axios.get(`${supplierServiceUrl}/api/supplier/qualified-list`);
      qualifiedSuppliers = supplierServiceRes.data.data || [];
    } catch (err) {
      console.error('Supplier Microservice unreachable:', err.message);
    }

    console.log(`Successfully fetched ${qualifiedSuppliers.length} qualified suppliers from Supplier Service.`);

    // 3. Map through companies and check qualification based on the date-filtered suppliers
    const mappedSuppliers = invoiceCompanies.map((company) => {
      const plainCompany = company.get({ plain: true });

      // Match by email or company name (case-insensitive)
      const matchingSupplier = qualifiedSuppliers.find(
        (s) =>
          (s.email && plainCompany.email && s.email.toLowerCase() === plainCompany.email.toLowerCase()) ||
          (s.name && plainCompany.companyName && s.name.toLowerCase() === plainCompany.companyName.toLowerCase())
      );

      const isQualified = Boolean(matchingSupplier);

      return {
        ...plainCompany,
        supplierProfileId: matchingSupplier ? matchingSupplier.id : null,
        hasQualityCert: matchingSupplier ? matchingSupplier.hasQualityCert : false,
        expiryDate: matchingSupplier ? matchingSupplier.expiryDate : null,

        // Qualification flags
        isSupplierQualified: isQualified,     // 👈 Send directly to saveInvoice payload
        isNotQualified: !isQualified          // 👈 Used for UI warning badges
      };
    });

    res.status(200).json(mappedSuppliers);
  } catch (error) {
    console.error('Error fetching suppliers with qualification:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    let whereClause = {};
    let limit;
    let offset;

    if (req.query.pageSize != 'undefined' && req.query.page != 'undefined') {
      limit = parseInt(req.query.pageSize);
      offset = (parseInt(req.query.page) - 1) * limit;
      if (req.query.search != 'undefined') {
        const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
        // whereClause = {
        //   [Op.or]: [
        //     sequelize.where(
        //       sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('companyName'), ' ', '')),
        //       {
        //         [Op.like]: `%${searchTerm}%`
        //       }
        //     )
        //   ]
        // };
      }
    } else {
      if (req.query.search != 'undefined') {
        const searchTerm = req.query.search.replace(/\s+/g, '').trim().toLowerCase();
        whereClause = {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.fn('REPLACE', sequelize.col('companyName'), ' ', '')),
              {
                [Op.like]: `%${searchTerm}%`
              }
            )
          ]
        };
      }
    }

    const queryOptions = {
      order: [['id', 'ASC']]
    };

    if (limit) queryOptions.limit = limit;
    if (offset || offset === 0) queryOptions.offset = offset;
    if (Object.keys(whereClause).length > 0) queryOptions.where = whereClause;

    const company = await Company.findAll(queryOptions);
    const totalCount = await Company.count({ where: whereClause });

    if (req.query.page != 'undefined' && req.query.pageSize != 'undefined') {
      const response = {
        count: totalCount,
        items: company,
      };
      res.json(response);
    } else {
      res.json(company);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.addCompany = async (req, res) => {
  try {
    const {
      companyName,
      code,
      customer,
      supplier,
      contactPerson,
      designation,
      email,
      website,
      linkedIn,
      phoneNumber,
      address1,
      address2,
      city,
      country,
      state,
      zipcode,
      remarks,


    } = req.body;

    const compExist = await Company.findOne({
      where: { companyName: companyName }
    })
    if (compExist) {
      return res.send('There is already a company that exists under the same name.')
    }

    const company = new Company({
      companyName,
      code,
      customer,
      supplier,
      contactPerson,
      designation,
      email,
      website,
      linkedIn,
      phoneNumber,
      address1,
      address2,
      city,
      country,
      state,
      zipcode,
      remarks,

    });
    await company.save();
    res.send(company)


  } catch (error) {
    res.send(error.message);
  }
}

exports.updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const {
      companyName,
      code,
      customer,
      supplier,
      contactPerson,
      designation,
      email,
      website,
      linkedIn,
      phoneNumber,
      address1,
      address2,
      city,
      country,
      state,
      zipcode,
      remarks
    } = req.body;
    const company = await Company.findOne({ where: { id: companyId } });
    if (!company) {
      return res.send("Company not found");
    }
    company.companyName = companyName;
    company.code = code;
    company.customer = customer;
    company.supplier = supplier;
    company.contactPerson = contactPerson;
    company.designation = designation;
    company.email = email;
    company.website = website;
    company.linkedIn = linkedIn;
    company.phoneNumber = phoneNumber;
    company.address1 = address1;
    company.address2 = address2;
    company.city = city;
    company.country = country;
    company.state = state;
    company.zipcode = zipcode;
    company.remarks = remarks;
    await company.save();

    res.json(company);
  } catch (error) {
    res.send(error.message);
  }
}

exports.getCustomers = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { customer: true },
      order: [['createdAt', 'DESC']],
    });
    res.send(companies);
  } catch (error) {
    res.send(error.message); // Send a 500 status if there's an error
  }
}

exports.getSuplliers = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { supplier: true }, // Filter where supplier is true
      order: [['createdAt', 'DESC']],
    });
    res.send(companies);
  } catch (error) {
    res.send(error.message); // Send a 500 status if there's an error
  }
}

