// backend/app/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET:Route pour lister les Joueurs
router.get('/', userController.listerjoueurs);

// POST:Route pour créer un Joueur
router.post('/', userController.creerjoueur);

module.exports = router;