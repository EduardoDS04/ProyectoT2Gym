const express = require('express');
const router = express.Router();
const sesionController = require('../controllers/sesionController');

router.get('/', sesionController.sesiones);

module.exports = router;
