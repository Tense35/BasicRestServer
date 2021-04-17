// Terceros
const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

// Propios
const { actualizarImagen, actualizarImagenClaudinary, cargarArchivo, mostrarImagen  } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const {  validarArchivoSubir ,validarCampos } = require('../middlewares');

// Rutas

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id',
[
    validarArchivoSubir,
    check('id', 'El id debe de ser de Mongo').isMongoId(),
    check('coleccion').custom ( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarCampos
], actualizarImagenClaudinary);
//], actualizarImagen);

router.get('/:coleccion/:id',
[
    check('id', 'El id debe de ser de Mongo').isMongoId(),
    check('coleccion').custom ( c => coleccionesPermitidas( c, ['usuarios', 'productos']) ),
    validarCampos
], mostrarImagen);


module.exports = router;