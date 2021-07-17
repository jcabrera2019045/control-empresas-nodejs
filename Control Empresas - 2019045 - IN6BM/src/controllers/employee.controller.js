'use strict'

const employeeModel = require('../models/employee.model');
const strings = require('../constants/constants');
const bcrypt = require('bcrypt-nodejs');
const htmlToPdf = require('html-pdf');

exports.registemployee = (req, res) => {
    var employee = new employeeModel();
    var params = req.body;

    if (req.user.role === strings.companyRole) {
        if (params.name && params.place && params.department) {
            employee.name = params.name;
            employee.place = params.place;
            employee.department = params.department;
            employee.company = req.user.sub;

            employeeModel.find({
                $or: [{ name: employee.name }]
            }).exec((err, findedEmployee) => {
                if (err) return res.status(500).send({ mensaje: strings.addEmployeeError });
                if (findedEmployee && findedEmployee.length == 1) {
                    return res.status(500).send({ mensaje: strings.existingUser });
                } else {
                    bcrypt.hash(params.password, null, null, (err, encyptedPass) => {
                        employee.password = encyptedPass;
                        employee.save((err, savedemployee) => {
                            if (err) return res.status(404).send({ mensaje: strings.addemployeeError });

                            if (savedemployee) {
                                return res.status(200).send(savedemployee)
                            } else {
                                return res.status(404).send({ mensaje: strings.cantAddemployeeError })
                            }
                        })
                    })
                }
            })
        }
    } else {
        res.status(404).send({ mensaje: strings.permissionsError })
    }
}

exports.getemployees = (req, res) => {
    if (req.user.role != strings.companyRole) return res.status(500).send({ mensaje: strings.permissionsError })
    employeeModel.find({ company: req.user.sub }).exec((err, findemployee) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (!findemployee) return res.status(500).send({ mensaje: strings.getemployeeError });
        return res.status(200).send({ findemployee, Numero_de_Empleados: findemployee.length });
    })
}

exports.getEmployeesById = (req, res) => {
    var employeeId = req.params.employeeId;
    if (req.user.role != strings.companyRole) return res.status(500).send({ mensaje: strings.permissionsError })
    employeeModel.findById(employeeId, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (!findUser) return res.status(500).send({ mensaje: strings.unfindedEmployee });
        if (req.user.sub != findUser.company) return res.status(500).send({ mensaje: strings.permissionsError });
        return res.status(200).send({ findUser });
    })
}

exports.getEmployeesByName = (req, res) => {
    var employeeName = req.params.employeeName;
    if (req.user.role != strings.companyRole) return res.status(500).send({ mensaje: strings.permissionsError })
    employeeModel.find({ name: employeeName, company: req.user.sub }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (!findUser) return res.status(500).send({ mensaje: strings.unfindedEmployee });
        return res.status(200).send({ findUser });
    })
}

exports.getEmployeesByPlace = (req, res) => {
    var employeePlace = req.params.employeePlace;
    if (req.user.role != strings.companyRole) return res.status(500).send({ mensaje: strings.permissionsError })
    employeeModel.find({ place: employeePlace, company: req.user.sub }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (!findUser) return res.status(500).send({ mensaje: strings.unfindedEmployee });
        return res.status(200).send({ findUser });
    })
}


exports.getEmployeesByDepartment = (req, res) => {
    var employeeDepartment = req.params.employeeDepartment;
    if (req.user.role != strings.companyRole) return res.status(500).send({ mensaje: strings.permissionsError })
    employeeModel.find({ department: employeeDepartment, company: req.user.sub }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (!findUser) return res.status(500).send({ mensaje: strings.unfindedEmployee });
        return res.status(200).send({ findUser });
    })
}

exports.editemployee = (req, res) => {
    var employeeId = req.params.employeeId;
    var params = req.body;
    employeeModel.findById(employeeId, (err, findEmployees) => {
        if (err) return res.status(400).send({ mensaje: strings.requestError })
        if (findEmployees) {
            if (findEmployees.company == req.user.sub) {
                employeeModel.updateOne(findEmployees, params, { new: true }, (err, updatedEmployee) => {
                    if (err) return res.status(501).send({ mensaje: strings.requestError });
                    if (!updatedEmployee) return res.status(500).send({ mensaje: strings.updateEmployeeError })
                    return res.status(200).send({ mensaje: strings.succesfulEmployeeUpdate })
                })
            } else {
                return res.status(500).send({ mensaje: strings.permissionsError })
            }
        }
    })
}

exports.deleteEmployee = (req, res) => {
    var employeeId = req.params.employeeId;
    employeeModel.findById(employeeId, (_err, findEmployee) => {
        if (findEmployee) {
            if (findEmployee.company == req.user.sub) {
                employeeModel.deleteOne(findEmployee, (err) => {
                    if (err) return res.status(501).send({ mensaje: strings.requestError });
                    return res.status(200).send({
                        findEmployee,
                        mensaje: strings.deleteEmployee,
                    })
                })
            } else {
                return res.status(500).send({ mensaje: strings.permissionsError })
            }
        } else {


            return res.status(500).send({ mensaje: strings.unfindedEmployee })

        }
    })
}

exports.createPdf = (req, res) => {
    if (req.user.role != strings.companyRole) return res.status(500).send({ mensaje: strings.permissionsError })
    employeeModel.find({ company: req.user.sub }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });
        if (!findUser) return res.status(500).send({ mensaje: strings.unfindedEmployee });
        let employeesArray = [];
        findUser.forEach(employees => {
            employeesArray.push(employees);
        });

        const content = `
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
        <link rel="preconnect" href="https://fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <title>Control de Empleados</title>
    </head>
    <body>
        <div class="text-center" style="font-family: 'Roboto', sans-serif;">
            <br><h1><strong>Empleados ${req.user.name}</strong></h1>
            <p>Control de Empleados</p><br>
            <table class="table">
                <thead>
                    <tr class="text-center">
                    <th scope="col"><bold>Nombre</bold></th>
                    <th scope="col"><strong>Puesto</strong></th>
                    <th scope="col"><strong>Departamento</strong></th>
                    </tr>
                </thead>
                <tbody>
                ${employeesArray.map(employeesMap => `
                    <tr class="text-center">
                        <td>${employeesMap.name}</td>
                        <td>${employeesMap.place}</td>
                        <td>${employeesMap.department}</td>
                    </tr>
                `
        ).join('').replace(
            /['"{}']+/g, ''
        )}
                </tbody>
            </table>
        </div>
    </body>
    `;

        htmlToPdf.create(content).toFile('./src/pdf/employeesPdf.pdf', function (err, res) {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
            }
        });
        return res.status(200).send({ mensaje: 'PDF Creado Exitosamente' });
    });
}