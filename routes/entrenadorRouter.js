const express = require('express');
const router = express.Router();
const entrenadorController = require('../controllers/entrenadorController');


router.get('/', entrenadorController.entrenadores);

router.get('/add', entrenadorController.entrenadorAddFormulario);

router.post('/add', entrenadorController.entrenadorAdd);

router.get('/delete/:id', entrenadorController.entrenadorDelFormulario);

router.post('/delete/:id', entrenadorController.entrenadorDel);

router.get('/edit/:id', entrenadorController.entrenadorEditFormulario);

router.post('/edit/:id', entrenadorController.entrenadorEdit);

router.get('/:id/sesion', entrenadorController.verSesionesEntrenador);

module.exports = router;
