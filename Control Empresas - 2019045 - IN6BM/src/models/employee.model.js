'use strict'

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var employeeSchema = Schema({
    name: String,
    place: String,
    department: String,
    company: { type: Schema.Types.ObjectId, ref: 'usuario' },
});

module.exports = mongoose.model('empleado', employeeSchema);