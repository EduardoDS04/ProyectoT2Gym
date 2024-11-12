const express = require('express');
const router = express.Router();
const alumnoController = require('../controllers/clienteController');


router.get('/', clienteController.clientes);

router.get('/add', clienteController.clienteAddFormulario);

router.post('/add', clienteController.clienteAdd);

router.get('/del/:id', clienteController.clienteDelFormulario);

router.post('/del/:id', clienteController.clienteDel);

router.get('/edit/:id', clienteController.clienteEditFormulario);

router.post('/edit/:id', clienteController.clienteEdit);

module.exports = router;
