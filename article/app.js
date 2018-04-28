const Server = require('./server')
const path = require('path')

const auth = require('./controller/auth')
const article = require('./controller/article')

const parseBody = require('./middleware/parse-body')
const parseQuery = require('./middleware/parse-query')

const app = new Server({
  port: 1234,
  views: path.join(__dirname, 'views')
})

// 中间件
app.use(auth)
app.use(parseBody)
app.use(parseQuery)

// 默认跳转文章列表页
app.get('/', (req, res) => {
  res.redirect('/article')
})

// 路由配置
app.get('/article', article.list)
app.get('/article/:id(\\d+)', article.detail)
app.get('/article/search', article.search)
app.get('/article/add', article.add)
app.get('/article/edit/:id(\\d+)', article.edit)
app.get('/article/delete/:id(\\d+)', article.delete)
app.post('/article/save', article.save)

// 错误处理
 app.use(function (req, res, next) {
 	// body...
 	var err = new Error('Not Found');
 	err.status = 404;
 	next(err);
 })