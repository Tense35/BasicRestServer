// Terceros
const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

// Propios
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');



router.post('/login',
[
    check('correo', 'El correo es obligaotrio').isEmail(),
    check('password', 'La contraseña es obligaotria').not().isEmpty(),
    validarCampos
] ,login);


module.exports = router;