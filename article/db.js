const mysql = require('mysql')

// 连接数据库
module.exports = mysql.createConnection({
  host: 'liyahui.cn',
  user: 'node',
  password: 'node@db!!!',
  database: 'node'
})
