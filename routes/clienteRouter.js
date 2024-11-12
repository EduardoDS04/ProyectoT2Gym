const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');


router.get('/', clienteController.clientes);

router.get('/add', clienteController.clienteAddFormulario);

router.post('/add', clienteController.clienteAdd);

router.get('/delete/:id', clienteController.clienteDelFormulario);

router.post('/delete/:id', clienteController.clienteDel);

router.get('/edit/:id', clienteController.clienteEditFormulario);

router.post('/edit/:id', clienteController.clienteEdit);

module.exports = router;
