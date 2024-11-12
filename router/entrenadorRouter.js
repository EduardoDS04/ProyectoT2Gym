const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/entrenadorController');


router.get('/', entrenadorController.entrenadores);

router.get('/add', entrenadorController.entrenadorAddFormulario);

router.post('/add', entrenadorController.entrenadorAdd);

router.get('/del/:id', entrenadorController.entrenadorDelFormulario);

router.post('/del/:id', entrenadorController.entrenadorDel);

router.get('/edit/:id', entrenadorController.entrenadorEditFormulario);

router.post('/edit/:id', entrenadorController.entrenadorEdit);

module.exports = router;
