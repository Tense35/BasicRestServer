const { Router } = require('express');
const router = Router();

const { buscar } = require('../controllers/buscar');

router.get('/:coleccion/:termino', buscar );


module.exports = router;