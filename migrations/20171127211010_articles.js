
const Migration = require(__serverdir + '/framwork/migration');

class Articles extends Migration {
  /**
   * Do the migration
   */
  up() {
    this.connection.query(`
      CREATE TABLE IF NOT EXISTS article (
        id INT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
        author_id INT(5) UNSIGNED NOT NULL,
        author_name VARCHAR(20) NOT NULL,
        category_id INT(4) UNSIGNED NOT NULL DEFAULT '1',
        category_name VARCHAR(20) NOT NULL DEFAULT 'default',
        title VARCHAR(50) NOT NULL,
        poster VARCHAR(100),
        label VARCHAR(50),
        content TEXT NOT NULL,
        views INT(10) UNSIGNED NOT NULL DEFAULT '0',
        stars INT(10) UNSIGNED NOT NULL DEFAULT '0',
        create_time VARCHAR(15) NOT NULL,
        update_time VARCHAR(15) NOT NULL,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB CHARSET=utf8 COMMENT='文章表';
      `);
  }

  /**
   * Undo the migration
   */
  down() {
    this.connection.query(`
      DROP TABLE article;
      `);
  }
}

module.exports = Articles;
