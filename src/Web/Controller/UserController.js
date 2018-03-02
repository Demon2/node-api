const BaseController = require(__serverdir + '/framwork/BaseController');

class UserController extends BaseController {
  indexAction(req, res) {
    this.JSON({
      id: req.params.id
    })
  }
}

module.exports = UserController;