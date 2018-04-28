const db = require('../db')
const marked = require('marked')

/**
 * 获取文章列表
 */
exports.list = (req, res) => {
  const sql = `SELECT * FROM article`

  db.query(sql, (err, result) => {
    if (result) {
      res.render('article/list', {
        title: '文章列表',
        list: result
      })
    } else {
      res.render('message', {
        type: 'danger',
        reason: '获取数据失败'
      })
    }
  })
}

/**
 * 获取文章详情
 */
exports.detail = (req, res) => {
  const sql = `SELECT * FROM article WHERE id=${req.params.id}`

  db.query(sql, (err, result) => {
    if (result.length) {
      const article = result.shift()
      article.content = marked(article.content)
      res.render('article/detail', {
        article
      })
    } else {
      res.render('message', {
        type: 'danger',
        reason: '文章不存在'
      })
    }
  })
}

/**
 * 搜索文章
 */
exports.search = (req, res) => {
  if (req.query.keyword) {
    const sql = `SELECT * FROM article WHERE title like '%${req.query.keyword}%'`

    db.query(sql, (err, result) => {
      res.render('article/list', {
        title: '搜索结果',
        list: result,
        keyword: req.query.keyword
      })
    })
  } else {
    res.redirect('/article')
  }
}

/**
 * 渲染添加文章模板
 */
exports.add = (req, res) => {
  res.render('article/form', {
    title: '添加文章'
  })
}

/**
 * 渲染修改文章模板
 */
exports.edit = (req, res) => {
  const sql = `SELECT * FROM article WHERE id=${req.params.id}`

  db.query(sql, (err, result) => {
    if (result.length) {
      const article = result.shift()
      article.preview = marked(article.content)

      res.render('article/form', {
        title: '编辑文章',
        article
      })
    } else {
      res.render('message', {
        type: 'danger',
        reason: '文章不存在'
      })
    }
  })
}

/**
 * 添加或者保存文章，有id为修改文章
 */
exports.save = (req, res) => {
  const now = parseInt(Date.now() / 1000)
  const values = [req.body.title, req.body.content, now]
  let sql = ''

  if (req.body.id) {
    sql = 'UPDATE article SET title=?, content=?, updated_at=? WHERE id=?'
    values.push(req.body.id)
  } else {
    sql = 'INSERT INTO article (id, title, content, created_at) VALUES (null, ?, ?, ?)'
  }

  db.query(sql, values, (err, result) => {
    result ? res.redirect('/article') : res.render('message', {
      type: 'danger',
      reason: '操作失败'
    })
  })
}

/**
 * 删除文章
 */
exports.delete = (req, res) => {
  const sql = `DELETE FROM article WHERE id=${req.params.id}`

  db.query(sql, (err, result) => {
    result ? res.redirect('/article') : res.render('message', {
      type: 'danger',
      reason: '删除失败'
    })
  })
}
