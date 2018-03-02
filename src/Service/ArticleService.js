const BaseController = require(__serverdir + '/framwork/BaseController');

class TokenService extends BaseController {

  create(article) {
    return new Promise((resolve, reject) => {
      if (!article.categoryId) {
        article.categoryId = '0';
        article.categoryName = 'default';
      }
      article.createTime = article.updateTime = Date.now();
      this.db.query(`INSERT INTO article SET ?`, {
        author_id: article.user.id,
        author_name: article.user.nickname,
        category_id: article.categoryId,
        category_name: article.categoryName,
        title: article.title,
        label: article.label.join(','),
        content: article.content,
        views: 0,
        stars: 0,
        create_time: article.createTime,
        update_time: article.updateTime,
      }, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve({
          id: result.insertId,
          authorName: article.user.nickname,
          categoryName: article.categoryName, // 文章类别
          label: article.label, // 文章标签
          createTime: 12321321421,  // 文章创建时间
          updateTime: 12321421421,
          views: 0,
          starts: 0,
        });
      });
    });
  }

  getArticles() {
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT * FROM article ORDER BY create_time DESC`, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    })
  }

  getArticleById(id) {
    return new Promise((resolve, reject) => {
      this.db.query(`SELECT * FROM article WHERE ?`, { id }, (err, result) => {
        if (err) { reject(err); }
        resolve(result);
      });
    });
  }

  deleteById(id) {
    return new Promise((resolve, reject) => {
      this.db.query(`DELETE FROM article WHERE ?`, { id }, (err, result) => {
        if (err) { reject(err); }
        resolve(result);
      });
    })
  }
}

module.exports = TokenService;