const url = require('url')

/**
 * 解析query参数挂载到req
 */
module.exports = (req, res, next) => {
  req.query = url.parse(req.url, true).query || {}
  next()
}
