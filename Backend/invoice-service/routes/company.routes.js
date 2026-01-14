const express = require('express');
const router = express.Router();
const CompController = require('../controllers/company.controller');

router.get("/find", CompController.getCompanies);

router.post("/", CompController.addCompany);

router.patch("/:id", CompController.updateCompany);

router.get("/customers", CompController.getCustomers);

router.get("/suppliers", CompController.getSuplliers);
module.exports = router;