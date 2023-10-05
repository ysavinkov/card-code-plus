const pool = require('../db');
const Model = require('../model');

class Card extends Model {
    static tableName = 'cards';

    constructor(attributes) {
        super(attributes);
    }

    static async getAllCards() {
        try {
            const [rows] = await pool.query('SELECT * FROM ??', [this.tableName]);
            // console.log('Содержимое переменной row:', JSON.stringify(rows, null, 2))
            const cards = rows.map((row) => new Card(row));
            return cards;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Card;
