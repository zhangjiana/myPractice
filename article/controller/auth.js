const basicAuth = require('basic-auth')

/**
 * 利用中间件进行权限验证
 */
module.exports = (req, res, next) => {
  const user = basicAuth(req)
  if (user && user.name === 'admin' && user.pass === 'nodejs') {
    next()
  } else {
    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic')
    res.end()
  }
}
