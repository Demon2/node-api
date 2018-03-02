const BaseController = require(__serverdir + '/framwork/BaseController');

class ArticleController extends BaseController {
  updateAction(req, res) {
    const user = this.auth();
    if (!user) {
      this.error({
        code: '',
        message: '尚未登陆'
      });
    } else {
      const { nickname } = JSON.parse(req.body);
      this.getService('User').update(nickname, user.id).then((result) => {
        user.nickname = nickname;
        this.getService('Token').update(user);
        this.success(user);
      }).catch(err => {
        this.error({
          code: '',
          message: err.message
        });
      });
    }
  }
}

module.exports = ArticleController;