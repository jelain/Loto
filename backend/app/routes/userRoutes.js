// backend/app/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET:Route pour lister les Joueurs+Bot
router.get('/', userController.listerUtilisateur);

// GET:Route pour lister les Joueurs+Bot
router.get('/players', userController.listerJusteJoueur);

// GET:Route pour lister bots
router.get('/bots', userController.listerBots);

// POST:Route pour créer un Joueur
router.post('/', userController.creerjoueur);

// POST:Route pour générer des joueurs
router.post('/generer', userController.genererJoueurs);

// DELETE:Route pour supprimer les joueurs générés
router.delete('/delete/generer', userController.supprimerJoueursGenerer);

// DELETE:Route pour supprimer les joueurs
router.delete('/delete', userController.supprimerJoueurs);

module.exports = router;