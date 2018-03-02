const BaseController = require(__serverdir + '/framwork/BaseController');

class DefaultController extends BaseController {

  indexAction(req, res) {
    this.JSON({
      name: 'ben',
      age: 18
    })
  }

  registerAction(req, res) {
    let { teleNum, password } = JSON.parse(req.body);
    if (!teleNum) {
      throw new Error('teleNum Required!');
    }
    if (!password) {
      throw new Error('password Required!');
    }
    password += '';
    if (teleNum && password) {
      const userService = this.getService('User');
      userService.getUserByTeleNum(teleNum).then((result) => {
        if (result.length) {
          throw new Error('该手机号已经被注册');
        }
        return userService.register(teleNum, password);
      }).then((result) => {
        this.success({
          id: result.insertId,
          teleNum: teleNum,
          role: 'ordinary',
        });
      }).catch((err) => {
        this.error({
          code: '111',
          message: err.message
        });
      });
    }
  }

  loginAction(req, res) {
    console.log('loginAction');
    
    const authorization = req.headers.authorization;
    if (!authorization) {
      this.error({
        code: '',
        message: '请通过正确的HTTP Basic Authorization方式登陆',
      });
      return;
    }

    const [teleNum, password] = new Buffer(authorization.split(' ').pop(), 'base64').toString().split(':');
    this.getService('User').login(teleNum, password).then((user) => {
      const token = this.getService('Token').getToken(user);
      this.success({
        id: user.id,
        teleNum: teleNum,
        role: user.role,
        token: token,
      });
    }).catch((err) => {
      this.error({
        code: '',
        message: err.message,
      });
    });
  }

  testTokenAction(req, res) {
    const { token } = JSON.parse(req.body);
    const user = this.getService('Token').getUser(token);
    if (user) {
      this.success(user);
    }
    this.error({
      code: '',
      message: '尚未登陆'
    });
  }
}

module.exports = DefaultController;