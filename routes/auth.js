// Terceros
const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

// Propios
const { login, googleSignin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

// Rutas
router.post('/login',
[
    check('correo', 'El correo es obligaotrio').isEmail(),
    check('password', 'La contraseña es obligaotria').not().isEmpty(),
    validarCampos
],   login);

router.post('/google',
[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin);


module.exports = router;