// Terceros
const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

// Propios
const { borrarCategoria, crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria } = require('../controllers/categorias');
const { noExisteCategoriaPorNombre, noExisteCategoria } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');


/*
    {{url}}/api/categorias

*/

// Rutas

// Obtener todas las categorías - Público
router.get('/', obtenerCategorias);

// Obtener una categoría por ID - Público
router.get('/:id', 
[
    check('id').custom( noExisteCategoriaPorNombre ),
    validarCampos
], obtenerCategoria);

// Crear categoría - Privado - Persona con token válido
router.post('/',
[
    validarJWT,
    check('estado', 'El estado es obligatorio').isBoolean().not().isEmpty(),
    validarCampos
], crearCategoria);




// Actualizar registro por ID - Privado - Persona con token válido
router.put('/:id', 
[
    validarJWT,
    check('id', 'El id no es un id válido de Mongo').isMongoId(),
    check('id').custom( noExisteCategoria ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

// Borrar una categoría - Privado - Persona Admin
router.delete('/:id', 
[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es un id válido de Mongo').isMongoId(),
    check('id').custom( noExisteCategoria ),
    validarCampos
], borrarCategoria);

module.exports = router;