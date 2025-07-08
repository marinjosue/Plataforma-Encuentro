const express = require('express');
const router = express.Router();
const controller = require('../controllers/concierto.controller');

router.post('/', controller.crear);
router.get('/', controller.listar);
router.get('/:id', controller.obtener);

module.exports = router;
