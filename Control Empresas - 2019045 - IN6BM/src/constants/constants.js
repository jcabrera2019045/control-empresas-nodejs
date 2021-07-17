'use strict'

module.exports = Object.freeze({
    // general texts
    employeeRole: 'ROL_EMPLEADO',
    adminRole: 'ROL_ADMIN',
    companyRole: 'ROL_EMPRESA',
    requestError: 'Error en la peticion',
    consultError: 'Error en la consulta',
    permissionsError: 'No posees los permisos para hacer esto',
    emptyInformationError: 'Rellene los datos necesarios para crear la peticion',
    default: 'Por defecto',
    addUserError: 'Error al guardar el Usuario',
    cantRegistUser: 'No se ha podido registrar al Usuario',
    serverPort: 'El servidor esta arrancando en el puerto: 3000',
    existingUser: 'Usuario Existente',
    cantIdentifyUser: 'El usuario no se ha podido identificar',
    userCantEntry: 'El usuario no ha podido ingresar',

    // Index texts
    defaultAdminName: 'Admin',
    defaultAdminPass: '123456',
    defaultAdminRole: 'ROL_ADMIN',

    // Authenticated texts
    requestHeadersError: 'la peticion no tiene la cabecera de Autorización',
    expiredToken: 'El token ha expirado',
    unvalidToken: 'El token no es válido',

    // User Controller texts
    addCompanyError: 'Error al agregar la empresa',
    existingCompany: 'Empresa Existente',
    cantRegistCompany: 'No se ha podido registrar la empresa',
    updateCompanyError: 'No se ha podido actualizar la empresa',
    deleteCompanyError: 'No se ha podido eliminar la empresa',

    // Employee controller texts
    addEmployeeError: 'Error al agregar al empleado',
    cantAddEmployeeError: 'No se ha podido agregar al empleado',
    getEmployeeError: 'Error al obtener empleados',
    updateEmployeeError: 'Error al actualizar el empleado',
    succesfulEmployeeUpdate: 'Empleado actualizado exitosamente',
    deleteEmployee: 'Empleado eliminado exitosamente',
    unfindedEmployee: 'Empleado no encontrado',
})