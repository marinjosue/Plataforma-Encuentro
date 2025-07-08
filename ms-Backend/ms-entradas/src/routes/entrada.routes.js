const express = require('express');
const router = express.Router();
const controller = require('../controllers/entrada.controller');

router.post('/', controller.crear);             // crear entrada manual
router.get('/', controller.listar);             // listar todas
router.get('/:id', controller.obtener);         // buscar por ID

module.exports = router;
