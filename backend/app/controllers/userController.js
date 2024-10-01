// backend/app/controllers/userController.js
const User = require('../models/userModel');

// Créer un nouvel joueur
exports.creerjoueur = async (req, res) => {
    const { pseudo, grille, etoile } = req.body;

    // Validation de base
    if (!pseudo || !grille || !etoile) {
        return res.status(400).json({ message: 'Pseudo, grille et étoile sont requis.' });
    }

    if (!Array.isArray(grille) || grille.length !== 5 || !grille.every(num => Number.isInteger(num) && num >= 1 && num <= 49)) {
        return res.status(400).json({ message: 'La grille doit contenir exactement 5 chiffres entre 1 et 49.' });
    }

    if (!Array.isArray(etoile) || etoile.length !== 2 || !etoile.every(num => Number.isInteger(num) && num >= 1 && num <= 9)) {
        return res.status(400).json({ message: 'L\'étoile doit contenir exactement 2 chiffres entre 1 et 9.' });
    }

    try {
        // Vérifier si le pseudo existe déjà
        const existingUser = await User.findByPseudo(pseudo);
        if (existingUser) {
            return res.status(400).json({ message: 'Le pseudo existe déjà. Veuillez en choisir un autre.' });
        }

        // Créer le nouvel joueur avec grille et étoile
        const nouveljoueur = new User(pseudo, grille, etoile);
        await nouveljoueur.save();
        res.status(201).json({ message: 'joueur créé avec succès', joueur: nouveljoueur });
    } catch (error) {
        console.error('Erreur lors de la création de l\'joueur:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la création de l\'joueur.' });
    }
};


// Liste des joueurs
exports.listerjoueurs = async (req, res) => {
    try {
        const joueurs = await User.findAll();
        res.status(200).json(joueurs);
    } catch (error) {
        console.error('Erreur lors de la récupération des joueurs:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la récupération des joueurs.' });
    }
};
