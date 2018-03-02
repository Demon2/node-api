const URL = require('url');
const path = require('path');
const PathUtil = require(__serverdir + '/src/utils/Path');
const Router = require(__serverdir + '/framwork/Router');
const multiparty = require('multiparty');

class BootStrap {

  constructor(httpServer) {
    this.httpServer = httpServer;
    this.Router = new Router();
    httpServer.on('request', (req, res) => {
      // 设置允许跨域
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST,GET,DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-FEZ-API-Token');

      // 匹配路由规则
      this.matchRouter(req, res);

      // 处理 POST 请求实体
      if (req.method === 'POST') {
        if (req.headers['content-type']) {
          const contentType = req.headers['content-type'].split(';', 2)[0];
          console.log(contentType);
          // 处理 multipart/form-data 请求实体
          if (contentType == 'multipart/form-data') {
            req.body = {}
            const form = new multiparty.Form();
            form.parse(req, (err, fields, files) => {
              req.body.files = files;
              req.body.fields = fields;
              try {
                this.execController(req, res);
              } catch(e) {
                res.end(e.message);
                return;
              }
            });
          }
          // 处理 application/json 的请求实体
          if (contentType === 'application/json' || contentType === 'text/plain') {
            req.body = '';
            req.on('data', (data) => {
              req.body += data.toString();
            });
            req.on('end', () => {
              try {
                this.execController(req, res);
              } catch(e) {
                res.end(e.message);
                return;
              }
            });
          }
        }
      }
      if (req.method === 'OPTIONS') {
        res.end();
        return;
      }
      
      // 处理无实体的请求类型
      if (req.method === 'GET' || req.method === 'DELETE') {
        try {
          this.execController(req, res);
        } catch(e) {
          res.end(e.message);
          return;
        }
      }
      return;
    });
  }

  matchRouter(req, res) {
    const url = URL.parse(req.url);
    const isStatic = PathUtil.isStaticFile(url.pathname);
    if (isStatic) {
      throw new Error('Request: ${req.url} \n404 Not fond!');
    }
    const route = Object.values(this.Router.routers).find(value => {
      req.params = {};
      const params = [];
      const path = value.path.replace(/\/{(.+?)}/g, (res, $1) => {
        params.push($1);
        return '/(.+?)';
      });
      const regStr = `^${path}$`;
      const reg = new RegExp(regStr);
      const result = url.pathname.match(reg);
      if (result) {
        params.map((param, index) => {
          req.params[param] = result[index + 1];
        });
        return true;
      }
      return false;
    });
    if (route) {
      req.route = route;
      const [bundleName, controllerName, actionName] = route.controller.split(':');
      req.route.bundleName = bundleName;
      req.route.controllerName = controllerName;
      req.route.actionName = actionName;
      req.route.controllerFile = `${bundleName}/Controller/${controllerName}Controller.js`;
      console.log(   req.route.controllerFile );
      req.route.controllerClass = require(path.resolve(__serverdir, 'src', req.route.controllerFile));
      return;
    }
    throw new Error(`404`);
  }

  execController(req, res) {
    let instance = new req.route.controllerClass(req, res);
    req.on('end', () => {
      instance = null;
    });
    try {
      instance[`${req.route.actionName}Action`](req, res);
    } catch(e) {
      instance.error({
        message: e.message,
      });
    }
  }

}

module.exports = BootStrap;
