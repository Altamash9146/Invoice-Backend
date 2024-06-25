const express = require('express');
const invoiceRoutes = express.Router();
const path = require('path');

const { generateInvoice } = require("../controller/generateInvoice");

invoiceRoutes.post("/generate-invoice", generateInvoice);
invoiceRoutes.use('/invoices', express.static(path.join(__dirname, '..', 'invoices')));

module.exports = invoiceRoutes;
