const Company = require("../models/company");
const { Op, sequelize } = require('sequelize');
const axios = require('axios');

exports.getSuppliersWithQualification = async (req, res) => {
  try {
    const supplierServiceUrl = process.env.SUPPLIER_SERVICE_URL || 'http://localhost:3000';
    const url = `${supplierServiceUrl}/api/supplier/qualified-list`;

    // Fetch suppliers directly from Supplier Microservice
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        Authorization: req.headers.authorization || ''
      }
    });

    const suppliers = response.data?.data || response.data || [];

    // Map suppliers so they directly expose supplierProfileId (UUID)
    const formattedSuppliers = suppliers.map((supplier) => ({
      supplierProfileId: supplier.id || supplier.supplierProfileId,
      supplierCompanyId: supplier.companyId || null,
      companyName: supplier.companyName || supplier.name,
      email: supplier.email,
      hasQualityCert: !!supplier.hasQualityCert,
      expiryDate: supplier.expiryDate || null,
      isSupplierQualified: supplier.isQualified ?? true
    }));

    return res.status(200).json({
      success: true,
      data: formattedSuppliers
    });

  } catch (error) {
    console.error('Supplier Service Fetch Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.message || 'Failed to fetch suppliers from Supplier Service'
    });
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

