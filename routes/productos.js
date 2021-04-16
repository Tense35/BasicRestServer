// Terceros
const { check } = require('express-validator');
const { Router } = require('express');
const router = Router();

// Propios
const {  actualizarProducto, crearProducto, obtenerProducto, obtenerProductos, borrarProducto } = require('../controllers/productos');
const { noExisteCategoriaPorNombre, noExisteCategoria, existeProducto, existeProductoPorId, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

// Rutas

// Crear productos - Privado - Persona con token válido
router.post('/',
[
    validarJWT,
    check('categoria', 'El id de la categoría no es un id de mongo válido').isMongoId(),
    check('categoria').custom( noExisteCategoria ),
    check('nombre').custom( existeProducto ),
    check('estado', 'El estado es obligatorio').isBoolean().not().isEmpty(),
    check('desc', 'La descripción(desc) es obligatorio').not().isEmpty(),
    check('disponible', 'La disponibilidad debe ser verdadero o falso').isBoolean(),
    validarCampos
], crearProducto);

// Obtener todos los productos - Público
router.get('/', obtenerProductos);

// Obtener un producto por ID - Público
router.get('/:id', 
[
    check('id', 'No es un id de mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], obtenerProducto);

// Actualizar producto por ID - Privado - Persona con token válido
router.put('/:id', 
[
    validarJWT,
    check('id', 'El id no es un id válido de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], actualizarProducto);









// Borrar una categoría - Privado - Persona Admin
router.delete('/:id', 
[
    validarJWT,
    esAdminRole,
    check('id', 'El id no es un id válido de Mongo').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], borrarProducto);

module.exports = router;