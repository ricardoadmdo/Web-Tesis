const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares');
const { existeCafeteriaPorId } = require('../helpers/db-validators');
const { cafeteriaGet, cafeteriaPut, cafeteriaPost, cafeteriaDelete, cafeteriaBuscar } = require('../controllers/cafeterias');
const router = Router();

router.get('/', cafeteriaGet);
router.get('/search', cafeteriaBuscar);
router.post('/', [check('nombre', 'El nombre es obligatorio').not().isEmpty(), validarCampos], cafeteriaPost);

router.put('/:id', [check('id', 'No es un ID válido de Mongo').isMongoId(), check('id').custom(existeCafeteriaPorId)], cafeteriaPut);

router.delete(
	'/:id',
	[check('id', 'No es un ID válido de Mongo').isMongoId(), check('id').custom(existeCafeteriaPorId), validarCampos],
	cafeteriaDelete
);

module.exports = router;
