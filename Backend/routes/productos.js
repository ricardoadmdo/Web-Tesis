const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares');
const { existeProductoPorId } = require('../helpers/db-validators');
const { productosGet, productosPut, productosPost, productoDelete, productosBuscar } = require('../controllers/productos');
const router = Router();

router.get('/', productosGet);
router.get('/search', productosBuscar);
router.post('/', [check('nombre', 'El nombre es obligatorio').not().isEmpty(), validarCampos], productosPost);

router.put('/:id', [check('id', 'No es un ID válido de Mongo').isMongoId(), check('id').custom(existeProductoPorId)], productosPut);

router.delete(
	'/:id',
	[check('id', 'No es un ID válido de Mongo').isMongoId(), check('id').custom(existeProductoPorId), validarCampos],
	productoDelete
);

module.exports = router;
