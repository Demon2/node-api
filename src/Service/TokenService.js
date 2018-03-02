const BaseController = require(__serverdir + '/framwork/BaseController');
const uuidV4 = require('uuid/v4');

const tokens = Object.create(null);

class TokenService extends BaseController {

  getToken(user) {
    this.findToken(user.id);
    const token = new Buffer(uuidV4() + ':' + user.id).toString('base64');
    tokens[token] = {
      id: user.id,
      nickname: user.nickname,
      teleNum: user.tele_num,
      role: user.role,
      token,
    };
    return token;
  }

  getUser(token) {
    return tokens[token];
  }

  findToken(userId) {
    const result = Object.keys(tokens).find((token) => {
      return tokens[token].id === userId;
    });
    if (result) {
      delete tokens[result];
    }
  }

  update(user) {
    tokens[user.token] = user;
  }
}

module.exports = TokenService;