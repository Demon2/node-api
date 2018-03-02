const BaseController = require(__serverdir + '/framwork/BaseController');
const bcrypt = require('bcrypt');

class UserService extends BaseController {

  getUserByTeleNum(teleNum) {
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT * FROM user WHERE ?`, {
        tele_num: teleNum,
      }, (err, result) => {
        if (err) { reject(err); }
        resolve(result);
      });
    });
  }

  register(teleNum, password) {
    return new Promise((resolve, reject) => {
      const saltRounds = this.config.env.bcrypt && this.config.env.bcrypt.saltRounds || 10;
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          this.db.query(`INSERT INTO user SET ?`, {
            tele_num: teleNum,
            hash,
            salt,
            create_time: Date.now(),
            update_time: Date.now(),
          }, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
        });
      });
    });
  }

  login(teleNum, password) {
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT * FROM user WHERE ?`, {
        tele_num: teleNum,
      }, (err, result) => {
        if (err) { reject(err); }
        if (result.length) {
          bcrypt.compare(password, result[0].hash, (err, same) => {
            if (err) {reject(err)}
            if (!same) {reject({code: 111, message: '用户名和密码不匹配'})}
            resolve(result[0]);
          });
        }
      });
    });
  }

  update(nickname, userId) {
    return new Promise((resolve, reject) => {
      this.db.query(`UPDATE user SET nickname = ? WHERE id = ?`, [nickname, userId], (err, result) => {
        if(err) reject(err);
        resolve(true);
      });
    });
  }
}

module.exports = UserService;