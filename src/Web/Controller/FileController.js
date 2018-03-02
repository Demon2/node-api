const BaseController = require(__serverdir + '/framwork/BaseController');
const fs = require('fs');
const dateFormat = require('date-format');
const mkdirp = require('mkdirp');

class FileController extends BaseController {
  uploadAction(req, res) {
    const [year, month, day, hour, mm, ss, SSS] = dateFormat('yyyy,MM,dd,hh,mm,ss,SSS', new Date()).split(',');
    const filename = `${hour}${mm}${ss}${SSS}`;
    const uploaderFolder = __serverdir + '/files';
    mkdirp(`${uploaderFolder}/${year}/${month}-${day}`, (err, res) => {
      if (err) {
        this.error(err);
        return
      }
    });
    // fs.writeFile(__serverdir + '/files/test1.jpg', buffer, { flag: 'a' }, (err) => {
    //   if (err) {
    //     this.error({
    //       code: '',
    //       message: err.message
    //     });
    //   } else {
    //     this.success();
    //   }
    // });
  }
}

module.exports = FileController;