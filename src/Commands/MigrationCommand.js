const fs = require('fs');
const path = require('path');
const DateUtil = require(__serverdir + '/src/utils/Date');
const StringUtil = require(__serverdir + '/src/utils/String');
const migrationsPath = path.resolve(__serverdir, 'migrations');

const template = `
const Migration = require(__serverdir + '/framwork/migration');

class {{ClassName}} extends Migration {
  /**
   * Do the migration
   */
  up() {
    this.connection.query(\`
      // Please write your sql statement here.
      \`);
  }

  /**
   * Undo the migration
   */
  down() {
    this.connection.query(\`
      // Please write your sql statement here.
      \`);
  }
}

module.exports = {{ClassName}};
`

class MigrationCommand {

  create(argv) {
    if (!argv.length) {
      throw new Error('必须填写名称');
    }

    let name = '';
    let className = '';
    argv.map(arg => {
      name += `_${arg}`;
      className += StringUtil.upperCase1stString(arg);
    });
    console.log(className);

    const time = DateUtil.getLocalTimeString();
    const filename = `${time}${name}.js`;
    let migrationFileContent = template.replace(/{{(.+?)}}/g, className);
    const writeStream = fs.createWriteStream(path.resolve(migrationsPath, filename), { flag: 'a' });
    writeStream.write(migrationFileContent);
    writeStream.end();
  }

  migrate() {
    const migrations = fs.readdirSync(migrationsPath);
    if (migrations.length) {
      migrations.map((filename, index) => {
        const MigrationClass = require(path.resolve(migrationsPath, filename));
        const instance = new MigrationClass();
        instance.up();
        console.log(`Migrate ${filename} successfully.`);
        if (index === (migrations.length - 1)) {
          instance.close();
        }
      });
    }
  }

  up(argv) {
    this.__upAndDown('up', argv);
  }

  down(argv) {
    this.__upAndDown('down', argv);
  }

  __upAndDown(cmd, argv) {
    if (!argv.length) {
      console.error(`Error: Not enough arguments (missing: "version").`);
      process.exit(1);
    }
    const migrations = fs.readdirSync(migrationsPath);
    const filename = migrations.find(filename => filename.indexOf(argv[0]) === 0);
    if (filename) {
      const MigrationClass = require(path.resolve(migrationsPath, filename));
      const instance = new MigrationClass();
      instance[cmd]();
      instance.close();
    }
  }
}

module.exports = MigrationCommand;