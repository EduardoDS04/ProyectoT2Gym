const express = require('express');
const router = express.Router();
const planMembresiaController = require('../controllers/planMembresiaController'); // Asegúrate de importar correctamente el controlador

// Ruta para listar planes de membresía
router.get('/', planMembresiaController.listarPlanes);

// Ruta para asignar un plan
router.post('/asignar/:id_Plan', planMembresiaController.asignarPlan);

module.exports = router;
