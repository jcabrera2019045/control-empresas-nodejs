'use strict'

const express = require("express");
const employeeController = require("../controllers/employee.controller")

var md_authentication = require("../middlewares/authenticated")

var api = express.Router();

api.post('/registemployee', md_authentication.ensureAuth, employeeController.registemployee);
api.get('/getemployees', md_authentication.ensureAuth, employeeController.getemployees);
api.get('/getEmployeesById/:employeeId', md_authentication.ensureAuth, employeeController.getEmployeesById);
api.get('/getEmployeesByName/:employeeName', md_authentication.ensureAuth, employeeController.getEmployeesByName);
api.get('/getEmployeesByPlace/:employeePlace', md_authentication.ensureAuth, employeeController.getEmployeesByPlace);
api.get('/getEmployeesByDepartment/:employeeDepartment', md_authentication.ensureAuth, employeeController.getEmployeesByDepartment);
api.put('/editEmployee/:employeeId', md_authentication.ensureAuth, employeeController.editemployee);
api.delete('/deleteEmployee/:employeeId', md_authentication.ensureAuth, employeeController.deleteEmployee);
api.get('/createPdf', md_authentication.ensureAuth, employeeController.createPdf);

module.exports = api;