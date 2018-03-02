const BaseController = require(__serverdir + '/framwork/BaseController');

class ArticleController extends BaseController {
  createAction(req, res) {
    const user = this.auth();
    if (!user) {
      this.error({
        code: '',
        message: 'Please login firstly.'
      });
      return;
    }
    if (!user.nickname) {
      this.error({
        code: '',
        message: '用户名尚未设置，请先完善用户资料'
      });
      return;
    }
    const article = JSON.parse(req.body);
    article.user = user;
    if (!article.label) {
      article.label = [];
    }
    if (!Array.isArray(article.label)) {
      this.error({
        code: '',
        message: 'article.label 参数格式不正确'
      });
      return;
    }
    ['title', 'content'].map((key) => {
      if (!article[key]) {
        this.error({
          code: '',
          message: `${key} 参数缺失`
        });
      }
    });
    this.getService('Article').create(article).then((article) => {
      this.success(article);
    }).catch((err) => {
      this.error({
        code: '',
        message: err.message
      });
    });
  }

  updateAction(req, res) {
    const user = this.auth();
  }

  deleteAction(req, res) {
    const user = this.auth();
    if (!user) {
      this.error({
        code: '',
        message: 'Please login firstly.'
      });
      return;
    }
    const articleId = req.params.id;
    this.getService('Article').deleteById(articleId).then((res) => {
      if (!res.affectedRows) {
        throw new Error('文章不存在');
      }
      this.success({});
    }).catch((e) => {
      this.error({
        code: '',
        message: e.message,
      });
    });
  }
}

module.exports = ArticleController;