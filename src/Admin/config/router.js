module.exports = {
  admin_index: {
    path: '',
    controller: 'Admin:Default:index',
  },
  admin_upload: {
    path: '/upload',
    controller: 'Admin:Default:upload',
  },
  user_update: {
    path: '/user/update',
    controller: 'Admin:User:update',
  },
  article_create: {
    path: '/article/create',
    controller: 'Admin:Article:create',
  },
  article_update: {
    path: '/articles/{id}/update',
    controller: 'Admin:Article:update',
  },
  article_delete: {
    path: '/articles/{id}',
    controller: 'Admin:Article:delete',
  },
}