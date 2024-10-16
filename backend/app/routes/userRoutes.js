// backend/app/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET:Route pour lister les Joueurs+Bot
router.get('/', userController.listerUtilisateur);

// GET:Route pour lister les Joueurs+Bot
router.get('/players', userController.listerJusteJoueur);

// POST:Route pour créer un Joueur
router.post('/', userController.creerjoueur);

// Nouvelle route pour générer des joueurs
router.post('/generer', userController.genererJoueurs);

// Nouvelle route pour supprimer les joueurs générés
router.delete('/generer', userController.supprimerJoueursGenerer);

//Lister bots
router.get('/bots', userController.listerBots);


module.exports = router;