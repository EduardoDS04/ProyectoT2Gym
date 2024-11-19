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

router.get('/mi-perfil', clienteController.miPerfil);

router.post('/mi-perfil', clienteController.actualizarPerfil);

router.post('/eliminar-perfil', clienteController.eliminarPerfil);

router.get('/registro', (req, res) => {
    res.render('Cliente/registro');
});

router.post('/registro', clienteController.registrarCliente);

module.exports = router;
