const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares');
const { existeComboPorId } = require('../helpers/db-validators');
const { combosGet, combosPut, combosPost, comboDelete, combosBuscar } = require('../controllers/combos');
const router = Router();

router.get('/', combosGet);
router.get('/search', combosBuscar);

router.post('/', [check('nombre', 'El nombre es obligatorio').not().isEmpty(), validarCampos], combosPost);

router.put('/:id', [check('id', 'No es un ID válido de Mongo').isMongoId(), check('id').custom(existeComboPorId)], combosPut);

router.delete('/:id', [check('id', 'No es un ID válido de Mongo').isMongoId(), check('id').custom(existeComboPorId), validarCampos], comboDelete);

module.exports = router;
