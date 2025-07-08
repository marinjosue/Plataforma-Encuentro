const express = require('express');
const router = express.Router();
const controller = require('../controllers/reserva.controller');

router.post('/', controller.crear);
router.post('/confirmar', controller.confirmar);
router.get('/:id', controller.obtener);
router.delete('/:id', controller.eliminar);

module.exports = router;
