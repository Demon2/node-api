
const Migration = require(__serverdir + '/framwork/migration');

class Files extends Migration {
  /**
   * Do the migration
   */
  up() {
    this.connection.query(`
      // Please write your sql statement here.
      `);
  }

  /**
   * Undo the migration
   */
  down() {
    this.connection.query(`
      // Please write your sql statement here.
      `);
  }
}

module.exports = Files;
