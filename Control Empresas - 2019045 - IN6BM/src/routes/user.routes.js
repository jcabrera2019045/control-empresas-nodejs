'use strict'

const express = require("express");
const userController = require("../controllers/user.controller")

var md_authentication = require("../middlewares/authenticated")

var api = express.Router();

api.post('/login', userController.login);
api.post('/companyRegistration/:adminId', md_authentication.ensureAuth, userController.companyRegistration);
api.get('/getUsers', userController.getUsers);
api.put('/editCompany/:adminId/:companyId', md_authentication.ensureAuth, userController.editCompany);
api.delete('/deleteCompany/:adminId/:companyId', md_authentication.ensureAuth, userController.deleteCompany);

module.exports = api;