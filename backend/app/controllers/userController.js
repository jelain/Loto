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
exports.listerUtilisateur = async (req, res) => {
    try {
        const joueurs = await User.findAll();
        res.status(200).json(joueurs);
    } catch (error) {
        console.error('Erreur lors de la récupération des joueurs:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la récupération des joueurs.' });
    }
};

// Supprimer les joueurs generer
exports.supprimerJoueursGenerer = async (req, res) => {
    try {
        const joueursSupprimes = await User.supprimerJoueursGenerer();
        const nombreSupprimes = joueursSupprimes.length;

        res.status(200).json({
            message: `${nombreSupprimes} joueur(s) généré(s) supprimé(s) avec succès.`,
            joueursSupprimes
        });
    } catch (error) {
        console.error('Erreur lors de la suppression des joueurs générés:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la suppression des joueurs générés.' });
    }
};

// Supprimer des joueurs
exports.supprimerJoueurs = async (req, res) => {
    const { pseudos } = req.body;

    try {
        if (pseudos && pseudos.length > 0) {
            // Supprimer les joueurs spécifiques par leurs pseudos
            const joueursSupprimes = await User.deletePlayerbyName(pseudos);
            res.status(200).json({
                message: `${joueursSupprimes} joueur(s) supprimé(s) avec succès.`,
            });
        } else {
            // Supprimer tous les joueurs
            const joueursSupprimes = await User.deleteAllPlayers();
            res.status(200).json({
                message: `Tous les joueurs ont été supprimés avec succès.`,
            });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression des joueurs:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la suppression des joueurs.' });
    }
};

// Générer plusieurs joueurs aléatoires
exports.genererJoueurs = async (req, res) => {
    const { nombre } = req.body;

    // Validation de l'entrée
    if (!nombre || !Number.isInteger(nombre) || nombre < 1 || nombre > 1000) {
        return res.status(400).json({ message: 'Veuillez fournir un nombre valide de joueurs à générer (1-1000).' });
    }

    try {
        // Appeler la méthode de génération de joueurs dans le modèle User
        const joueursGeneres = await User.genererJoueurs(nombre);

        res.status(201).json({
            message: `${joueursGeneres.length} joueur(s) généré(s) avec succès.`,
            joueurs: joueursGeneres
        });

        // Si le nombre de joueurs générés est inférieur au nombre demandé, envoyer un message informatif
        if (joueursGeneres.length < nombre) {
            const nonGeneres = nombre - joueursGeneres.length;
            return res.status(207).json({
                message: `${joueursGeneres.length} joueur(s) généré(s) avec succès. ${nonGeneres} joueur(s) n'ont pas pu être généré(s) (pseudo dupliqué).`
            });
        }
    } catch (error) {
        console.error('Erreur lors de la génération des joueurs:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la génération des joueurs.' });
    }
};

// Lister les utilisateurs générés
exports.listerBots = async (req, res) => {
    try {
        const bots = await User.findAllBot(); // Appeler la méthode pour récupérer les utilisateurs générés
        res.status(200).json(bots); // Retourner les utilisateurs générés
    } catch (error) {
        console.error('Erreur lors de la récupération des bots:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la récupération des utilisateurs générés.' });
    }
};

// Lister les utilisateurs crée seulement
exports.listerJusteJoueur = async (req, res) => {
    try {
        const players = await User.findJustPlayer(); // Appeler la méthode pour récupérer les joueurs (utilisateurs crées)
        res.status(200).json(players); // Retourner les joueurs
    } catch (error) {
        console.error('Erreur lors de la récupération des joueurs:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la récupération des joueurs.' });
    }
};