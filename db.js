const mysql = require('mysql2/promise');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json'));

const pool = mysql.createPool(config.database);

module.exports = pool;

module.exports.validUser = async function validUser(username, password) {
    try {
      const [user] = await pool.query('SELECT id, amount_games, winned_games FROM users WHERE login = ? AND password = ?;', [username, password]);
      const isInBase = user.length > 0;
      if (isInBase) {
        return {
          isInBase: true,
          id: user[0].id,
          amountGames: user[0].amount_games,
          winnedGames: user[0].winned_games,
        };
      }
  
      return {
        isInBase: false,
        id: -1,
        amountGames: 0,
        winnedGames: 0,
      };
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
}


module.exports.isEmail = async function isEmail(email){
    return await pool.query('SELECT password FROM users WHERE email_address = ?', [email]);
}

module.exports.validateUserCredentials = async function validateUserCredentials(username, email) {
    //console.log(username);
    try {
      const [usernameCount] = await pool.query('SELECT COUNT(*) as usernameCount FROM users WHERE login = ?;', [username]);
      const [emailCount] = await pool.query('SELECT COUNT(*) as emailCount FROM users WHERE email_address = ?;', [email]);
      return {
        usernameExists: usernameCount[0].usernameCount > 0,
        emailExists: emailCount[0].emailCount > 0,
      };
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
