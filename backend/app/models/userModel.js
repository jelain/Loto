// backend/app/models/userModel.js
const pool = require('../config/db');

class User {
    constructor(pseudo, grille, etoile, generer = false) {
        this.pseudo = pseudo;
        this.grille = grille; // Array de 5 chiffres
        this.etoile = etoile; // Array de 2 chiffres
        this.generer = generer; // True ou false indique si le joueur a été génerer ou pas
        this.dateCreation = new Date(); // Date de creation du joueur
    }

    // Méthode pour sauvegarder l'joueur dans PostgreSQL
    async save() {
        const query = `
            INSERT INTO users (pseudo, grille, generer, date_creation, etoile)
            VALUES ($1, $2, $3, $4,$5)
            RETURNING *
        `; // Requete SQL
        const values = [
            this.pseudo,
            this.grille,
            this.generer,
            this.dateCreation,
            this.etoile,
        ];

        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
            // Gestion des erreurs (par exemple, duplication de pseudo)
            if (error.code === '23505') { // Code d'erreur PostgreSQL pour violation de contrainte unique
                throw new Error('Ce pseudo est déjà pris.');
            }
            throw error;
        }
    }

    // Méthode pour récupérer tous les joueurs
    static async findAll() {
        const query = `SELECT * FROM users`; // Requete SQL
        try {
            const res = await pool.query(query);
            // Convertir la grille de chaîne en array de nombres
            return res.rows.map(user => ({
                pseudo: user.pseudo,
                grille: user.grille,
                generer: user.generer,
                dateCreation: user.date_creation,
                etoile: user.etoile,
            }));
        } catch (error) {
            throw error;
        }
    }

    // Méthode statique pour trouver un joueur par pseudo
    static async findByPseudo(pseudo) {
        const query = `SELECT * FROM users WHERE pseudo = $1`; // Requete SQL
        const values = [pseudo];
        try {
            const res = await pool.query(query, values);
            if (res.rows.length > 0) {
                const user = res.rows[0];
                return {
                    pseudo: user.pseudo,
                    grille: user.grille,
                    generer: user.generer,
                    dateCreation: user.date_creation,
                    etoile: user.etoile,
                };
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Méthode statique pour supprimer tous les joueurs générés
    static async supprimerJoueursGenerer() {
        const query = `DELETE FROM users WHERE generer = $1 RETURNING *`;
        const values = [true];

        try {
            const res = await pool.query(query, values);
            return res.rows; // Retourne les joueurs supprimés
        } catch (error) {
            throw error;
        }
    }

    // Nouvelle méthode statique pour générer des joueurs
    static async genererJoueurs(nombre) {
        const joueurs = [];
        const pseudosExistants = new Set(); // Pour éviter les doublons de pseudos

        while (joueurs.length < nombre) {
            const pseudo = `Joueur${Math.floor(Math.random() * 10000)}`;
            if (pseudosExistants.has(pseudo)) continue; // Vérifier si le pseudo existe déjà

            // Générer une grille de 5 numéros uniques (1-49)
            const chiffresDisponibles = Array.from({ length: 49 }, (_, i) => i + 1);
            const grille = [];
            while (grille.length < 5) {
                const indexAleatoire = Math.floor(Math.random() * chiffresDisponibles.length);
                grille.push(chiffresDisponibles.splice(indexAleatoire, 1)[0]); // Sélectionner et retirer le nombre
            }

            // Générer 2 étoiles uniques (1-9)
            const etoilesDisponibles = Array.from({ length: 9 }, (_, i) => i + 1);
            const etoile = [];
            while (etoile.length < 2) {
                const indexAleatoire = Math.floor(Math.random() * etoilesDisponibles.length);
                etoile.push(etoilesDisponibles.splice(indexAleatoire, 1)[0]); // Sélectionner et retirer l'étoile
            }

            const generer = true; // Indique que le joueur a été généré

            // Créer un nouvel objet utilisateur avec pseudo, grille et étoiles
            const joueur = new User(pseudo, grille, etoile, generer);
            joueurs.push(joueur);
            pseudosExistants.add(pseudo); // Ajouter le pseudo à l'ensemble
        }

        // Enregistrer tous les joueurs générés dans la base de données
        const résultats = [];
        for (const joueur of joueurs) {
            try {
                const résultat = await joueur.save();
                résultats.push(résultat);
            } catch (error) {
                console.error(`Erreur lors de la sauvegarde de ${joueur.pseudo}: ${error.message}`);
            }
        }

        return résultats; // Retourne tous les joueurs générés
    }

    // Méthode pour récupérer tous les joueurs
    static async findAllBot() {
        const query = `SELECT * FROM users WHERE generer = true;`; // Requete SQL
        try {
            const res = await pool.query(query);
            // Convertir la grille de chaîne en array de nombres
            return res.rows.map(user => ({
                pseudo: user.pseudo,
                grille: user.grille,
                generer: user.generer,
                dateCreation: user.date_creation,
                etoile: user.etoile,
            }));
        } catch (error) {
            throw error;
        }
    }

    // Méthode pour récupérer tous les joueurs
    static async findJustPlayer() {
        const query = `SELECT * FROM users WHERE generer = false;`; // Requete SQL
        try {
            const res = await pool.query(query);
            // Convertir la grille de chaîne en array de nombres
            return res.rows.map(user => ({
                pseudo: user.pseudo,
                grille: user.grille,
                generer: user.generer,
                dateCreation: user.date_creation,
                etoile: user.etoile,
            }));
        } catch (error) {
            throw error;
        }
    }

    // Méthode statique pour supprimer des joueurs spécifiques par leurs pseudos
    static async deletePlayerbyName(names) {
        if (!names || names.length === 0) {
            throw new Error("Aucun pseudo fourni pour la suppression.");
        }

        const query = `DELETE FROM users WHERE pseudo = ANY($1)`;
        const values = [names]; // Le tableau de pseudos est passé comme paramètre

        try {
            const res = await pool.query(query, values);
            return res.rowCount; // Retourne le nombre de lignes supprimées
        } catch (error) {
            throw error; // Propagation de l'erreur en cas d'échec
        }
    }

    // Méthode statique pour supprimer tous les joueurs
    static async deleteAllPlayers() {
        const query = `DELETE FROM users`;
        const values = []; // Aucune valeur n'est nécessaire pour cette requête

        try {
            const res = await pool.query(query, values);
            return res.rowCount; // Retourne le nombre de lignes supprimées
        } catch (error) {
            throw error; // Propagation de l'erreur en cas d'échec
        }
    }
}

module.exports = User;
