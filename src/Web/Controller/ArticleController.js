const BaseController = require(__serverdir + '/framwork/BaseController');

class ArticleController extends BaseController {
  listAction(req, res) {
    this.getService('Article').getArticles().then((articles) => {
      this.JSON(articles);
    }).catch((err) => {
      this.error({
        code: '',
        message: err.message
      });
    });
  }

  showAction(req, res) {
    const articleId = req.params.id;
    this.getService('Article').getArticleById(articleId).then((result) => {
      this.success(result[0]);
    }).catch(({ message }) => {
      this.error({
        code: '',
        message,
      });
    });
  }
}

module.exports = ArticleController;