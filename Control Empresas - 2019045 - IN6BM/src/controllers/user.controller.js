'use strict'

const userModel = require('../models/user.model');
const bcrypt = require("bcrypt-nodejs");
const jwt = require('../services/jwt')
const strings = require('../constants/constants');

exports.companyRegistration = (req, res) => {
    var user = new userModel();
    var adminId = req.params.adminId;
    var params = req.body;

    if (adminId != req.user.sub) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    if (params.name && params.password) {
        user.name = params.name;
        user.role = strings.companyRole;

        userModel.find({
            $or: [
                { name: user.name }
            ]
        }).exec((err, findUser) => {
            if (err) return res.status(500).send({ mensaje: strings.addCompanyError });

            if (findUser && findUser.length == 1) {
                return res.status(500).send({ mensaje: strings.existingCompany });
            } else {
                bcrypt.hash(params.password, null, null, (_err, encryptedPass) => {
                    user.password = encryptedPass;
                    user.save((_err, savedUser) => {
                        if (savedUser) {
                            res.status(200).send(savedUser)
                        } else {
                            res.status(404).send({ mensaje: strings.cantRegistCompany })
                        }
                    })
                })
            }
        })
    }
}

exports.login = (req, res) => {
    var params = req.body;

    userModel.findOne({ name: params.name }, (err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError });

        if (findUser) {
            bcrypt.compare(params.password, findUser.password, (_err, successfulPass) => {
                if (successfulPass) {
                    if (params.getToken === 'true') {
                        return res.status(200).send({
                            token: jwt.createToken(findUser)
                        });
                    } else {
                        findUser.password = undefined;
                        return res.status(200).send({ findUser })
                    }
                } else {
                    return res.status(404).send({ mensaje: strings.cantIdentifyUser })
                }
            })
        } else {
            return res.status(404).send({ mensaje: strings.userCantEntry })
        }
    })
}

exports.getUsers = (req, res) => {
    userModel.find((err, findUser) => {
        if (err) return res.status(500).send({ mensaje: strings.requestError })
        if (!findUser) return res.status(500).send({ mensaje: strings.consultError })
        return res.status(200).send({ findUser })
    })
}

exports.editCompany = (req, res) => {
    var companyId = req.params.companyId;
    var adminId = req.params.adminId;
    var params = req.body;

    delete params.password;

    if (adminId != req.user.sub) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    userModel.findByIdAndUpdate(companyId, params, { new: true }, (er, updatedCompany) => {
        if (er) return res.status(500).send({ mensaje: strings.requestError });
        if (!updatedCompany) return res.status(500).send({ mensaje: strings.updateCompanyError });
        return res.status(200).send({ updatedCompany });
    })
}

exports.deleteCompany = (req, res) => {
    const companyId = req.params.companyId;
    const adminId = req.params.adminId;

    if (adminId != req.user.sub) {
        return res.status(500).send({ mensaje: strings.permissionsError });
    }

    userModel.findByIdAndDelete(companyId, (er, deletedCompany) => {
        if (er) return res.status(500).send({ mensaje: strings.requestError });
        if (!deletedCompany) return res.status(500).send({ mensaje: strings.deleteCompanyError });
        return res.status(200).send({ deletedCompany });
    })
}