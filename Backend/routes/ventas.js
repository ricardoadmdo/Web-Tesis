const { Router } = require('express');
const { obtenerVentas, crearVenta, deleteVenta } = require('../controllers/ventas');
const router = Router();

router.get('/', obtenerVentas);
router.post('/', crearVenta);
router.delete('/:id', deleteVenta);

module.exports = router;
