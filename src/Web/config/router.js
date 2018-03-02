module.exports = {
  homepage: {
    path: '/',
    controller: 'Web:Default:index'
  },
  register: {
    path: '/register',
    controller: 'Web:Default:register'
  },
  login: {
    path: '/login',
    controller: 'Web:Default:login'
  },
  articles: {
    path: '/articles',
    controller: 'Web:Article:list'
  },
  article_detail: {
    path: '/articles/{id}',
    controller: 'Web:Article:show'
  },
  user: {
    path: '/user/{id}',
    controller: 'Web:User:index'
  },
  uploadFIle: {
    path: '/upload',
    controller: 'Web:File:upload'
  },
  testToken: {
    path: '/testToken',
    controller: 'Web:Default:testToken'
  }
}