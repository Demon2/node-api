const fs = require('fs');
const qiniu = require('qiniu');
const BaseController = require(__serverdir + '/framwork/BaseController');
const env = require(__serverdir + '/config/env');

const config = new qiniu.conf.Config();
config.zone = qiniu.zone[env.CDN.zone]; // 华东机房
const formUploader = new qiniu.form_up.FormUploader(config);
var mac = new qiniu.auth.digest.Mac(env.CDN.accessKey, env.CDN.secretKey);
var options = { scope: env.CDN.bucket };
const CDNDomain = '//p1ctdjvo8.bkt.clouddn.com';

class FileService extends BaseController {
  uploadToCDN(key, localFile) {
    var putExtra = new qiniu.form_up.PutExtra();
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, key, localFile, putExtra, function(respErr,
        respBody, respInfo) {
        console.log(localFile);
        if (respErr) reject(respErr);
        respBody.key = `${CDNDomain}/${respBody.key}`;
        fs.unlink(localFile, (err, res) => {
          if (err) reject(err)
          resolve(respBody);
        });
      });
    });
  }
}

module.exports = FileService;