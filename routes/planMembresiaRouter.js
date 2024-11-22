const express = require('express');
const router = express.Router();
const planMembresiaController = require('../controllers/planMembresiaController'); 

router.get('/', planMembresiaController.listarPlanes);

router.post('/asignar/:id_Plan', planMembresiaController.asignarPlan);

module.exports = router;
