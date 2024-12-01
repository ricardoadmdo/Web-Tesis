const { Router } = require('express');
const { createSession } = require('../controllers/pago');
const router = Router();

router.post('/create-checkout-session', createSession);

module.exports = router;
