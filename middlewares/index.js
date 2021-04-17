const validarRoles = require('../middlewares/validar-roles');
const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarArchivo = require('../middlewares/validar-archivo');

module.exports = 
{
    ...validarArchivo,
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}