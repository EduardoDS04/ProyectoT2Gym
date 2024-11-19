const express = require('express');
const router = express.Router();
const clientePlanController = require('../controllers/clientePlanController');

router.get('/', clientePlanController.listarPlanesCliente);
router.post('/eliminar/:id', clientePlanController.eliminarPlan); 

module.exports = router;
