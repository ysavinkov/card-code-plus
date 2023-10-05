const pool = require('./db');

class Model {
    constructor(attributes) {
      this.attributes = attributes;
    }
  
    async find(id) {
        try {
            const [row] = await pool.query('SELECT * FROM ?? WHERE id = ?;', [this.constructor.tableName, id]);
            if (row) {
              this.attributes = row[0];
              //console.log('Содержимое переменной row:', JSON.stringify(row, null, 2))
              return this;
            }
            
            return null;
          } catch (error) {
            throw error;
          }
    }
  
    async delete() {
      const id = this.attributes.id;
      if (!id) {
        throw new Error('Cannot delete without an ID');
      }
  
      try {
        await pool.query('DELETE FROM ?? WHERE id = ?', [this.constructor.tableName, id]);
        return true;
      } catch (error) {
        throw error;
      }
    }
  
    async save() {
      if (this.attributes.id) {
        // Update existing record
        const id = this.attributes.id;
        const { id: _, ...attributesToUpdate } = this.attributes;
        try {
          await pool.query('UPDATE ?? SET ? WHERE id = ?', [this.constructor.tableName, attributesToUpdate, id]);
          return true;
        } catch (error) {
          throw error;
        }
      } else {
        try {
          const [result] = await pool.query('INSERT INTO ?? SET ?', [this.constructor.tableName, this.attributes]);
          this.attributes.id = result.insertId;
          return true;
        } catch (error) {
          throw error;
        }
      }
    }
  }
  
  module.exports = Model;