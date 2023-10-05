const pool = require('../db');
const Model = require('../model'); 

class User extends Model {
  static tableName = 'users'; 

  constructor(attributes) {
    super(attributes);
  }
  
}


module.exports = User;