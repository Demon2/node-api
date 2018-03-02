const BaseController = require(__serverdir + '/framwork/BaseController');
const DateToolkit = require(__serverdir + '/src/utils/Date');

class ArticleController extends BaseController {
  indexAction(req, res) {
    this.JSON({
      name: 'admin'
    });
  }

  uploadAction(req, res) {
    const user = this.auth();
    const file = req.body.files['file'][0];
    const key = DateToolkit.getLocalTimeString() + '.' + file.originalFilename.split('.').pop();
    this.getService('File').uploadToCDN(key, file.path).then((res) => {
      this.success(res.key);
    });
  }
}

module.exports = ArticleController;