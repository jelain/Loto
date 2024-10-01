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

}

module.exports = User;
