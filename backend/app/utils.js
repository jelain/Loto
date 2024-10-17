// backend/app/utils.js

const { promisify } = require('util');
const pool = require('./config/db');

// Fonction pour vérifier si un pseudo existe déjà
async function existePseudo(pseudo) {
    const query = `SELECT 1 FROM users WHERE pseudo = $1`;
    const values = [pseudo];
    try {
        const res = await pool.query(query, values);
        return res.rows.length > 0;
    } catch (error) {
        throw error;
    }
}

async function genererPseudoUnique() {
    let pseudo;
    let existe = true;
    while (existe) {
        pseudo = genererPseudo();
        existe = await existePseudo(pseudo);
    }
    return pseudo;
}

module.exports = {
    genererPseudo,
    genererGrille,
    genererEtoiles,
    genererPseudoUnique
};
