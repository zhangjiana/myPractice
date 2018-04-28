const qs = require('qs')

/**
 * 解析POST过来的数据挂载到req
 */
module.exports = (req, res, next) => {
  let body = ''

  req.on('data', data => {
    body += data
  })

  req.on('end', () => {
    req.body = qs.parse(body)
    next()
  })
}
