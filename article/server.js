const url = require('url')
const http = require('http')
const path = require('path')
const mime = require('mime')
const fs = require('fs')
const pathToRegexp = require('path-to-regexp')
const Handlebars = require('handlebars')
const moment = require('moment')

// 默认配置
const defaultConfig = {
  port: 8080,
  static: 'static',
  views: 'views'
}

module.exports = class Server {

  /**
   * 构造函数
   * @param {Object} config         配置对象
   * @param {number} config.port    端口
   * @param {string} config.static  静态资源文件所在的根目录
   * @param {string} config.views   模板文件根目录
   */
  constructor(config) {
    this.config = Object.assign({}, defaultConfig, config)

    // 路由规则和处理函数存放对象，all 为存放中间件的处理函数
    this.routes = {
      all: [],
      get: [],
      post: [],
      put: [],
      delete: []
    }

    http.createServer(this.requestListener.bind(this)).listen(this.config.port, () => {
      console.log(`Listening at http://localhost:${this.config.port}`)
    })

    this.extendsResponse()
  }

  /**
   * 请求处理
   * @param  {Object} req 请求对象
   * @param  {Object} res 响应对象
   */
  requestListener(req, res) {
    this.req = req
    this.res = res

    // 获取到请求路径
    const pathname = url.parse(req.url).pathname

    // 请求路径如果以配置的静态目录开头，则处理静态文件，否则匹配路由
    if (pathname.startsWith(`/${this.config.static}`)) {
      this.handleStatic(pathname)
    } else {
      this.matchRouter(pathname)
    }
  }

  /**
   * 处理静态资源请求
   * @param {string} pathname 请求路径 
   */
  handleStatic(pathname) {
    pathname = path.normalize(pathname.substring(1))

    fs.stat(pathname, (err, stats) => {
      // 没有文件信息返回404
      if (err) {
        return this.res.error(404)
      }

      // 是目录返回403，也可以读取目录下的文件列出来
      if (stats.isDirectory()) {
        return this.res.error(403)
      }

      // 设置过期时间为一年
      const expires = Date.now() + (60 * 60 * 24 * 365 * 1000)
      // 获取文件最后修改时间
      const lastModified = stats.mtime.toUTCString()

      // 设置相应字段
      this.res.setHeader('Content-Type', mime.lookup(pathname))
      this.res.setHeader('Content-Length', stats.size)
      this.res.setHeader('Last-Modified', lastModified)
      this.res.setHeader('Expires', new Date(expires).toUTCString())
      this.res.setHeader('Cache-Control', `max-age=${expires}`)

      // 如果请求头中的最后修改时间和服务器的文件最后修改时间一致，返回304从缓存读取
      if (this.req.headers['If-Modified-Since'] === lastModified) {
        this.res.statusCode = 304
        return this.res.end()
      }

      // 读取文件流，返回客户端
      const stream = fs.createReadStream(pathname)
      stream.pipe(this.res)
    })
  }

  /**
   * 匹配路由
   * @param {string} pathname 请求路径
   */
  matchRouter(pathname) {
    // 根据请求方法拿到对应的注册路由数组
    const routes = this.routes[this.req.method.toLowerCase()]
    // 将中间件处理函数放到最前面
    const stacks = [].concat(this.routes.all)
    // 保存请求路径中携带的参数
    const params = {}

    // 路由匹配
    let matched
    for (const route of routes) {
      matched = route.regexp.exec(pathname)
      if (matched) {
        stacks.push(route.handler)
        for (let i = 1; i < matched.length; i++) {
          params[route.regexp.keys[i - 1].name] = matched[i]
        }
        break
      }
    }

    // 没有匹配到注册的路由，返回404
    if (!matched) {
      return this.res.error(404)
    }

    this.req.params = params

    // 尾递归处理函数
    const next = () => {
      const middleware = stacks.shift()
      middleware && middleware(this.req, this.res, next)
    }

    next()
  }

  /**
   * 注册中间件，这里实现比较简单，Express中间件也是可以传入一个路径，而且会根据书写顺序来调用，这里把中间件放在了最前面来调用
   * @param {Function} handler 中间件处理方法
   */
  use(handler) {
    if (typeof handler !== 'function') {
      new Error('handler必须为方法')
    }
    this.routes.all.push(handler)
  }

  /**
   * 注册路由
   * @param {string} method     请求方法
   * @param {string} path       请求路径
   * @param {function} handler  处理函数
   */
  register(method, path, handler) {
    if (typeof path !== 'string') {
      new Error('path必须为字符串')
    }

    if (typeof handler !== 'function') {
      new Error('handler必须为方法')
    }

    this.routes[method].push({
      regexp: pathToRegexp(path),
      handler
    })
  }

  /**
   * 注册GET路由
   * @param {string} path       请求路径
   * @param {function} handler  处理函数
   */
  get(path, handler) {
    this.register('get', path, handler)
  }

  /**
   * 注册POST路由
   * @param {string} path       请求路径
   * @param {function} handler  处理函数
   */
  post(path, handler) {
    this.register('post', path, handler)
  }

  /**
   * 注册PUT路由
   * @param {string} path       请求路径
   * @param {function} handler  处理函数
   */
  put(path, handler) {
    this.register('put', path, handler)
  }

  /**
   * 注册DELETE路由
   * @param {string} path       请求路径
   * @param {function} handler  处理函数
   */
  delete(path, handler) {
    this.register('delete', path, handler)
  }

  /**
   * 扩展响应对象
   */
  extendsResponse() {

    /**
     * 渲染模板
     * @param  {string} template 模板路径
     * @param  {object} data     渲染数据
     */
    http.ServerResponse.prototype.render = (template, data) => {
      if (!template.endsWith('.hbs')) {
        template += '.hbs'
      }

      const fullPath = path.join(this.config.views, template)

      // 检查模板文件是否存在
      const exists = fs.existsSync(fullPath)

      if (exists) {
        // 读取模板内容
        const content = fs.readFileSync(fullPath)
          // 编译模板
        const result = Handlebars.compile(content.toString())(data)
          // 设置响应字段、输出编译的结果
        this.res.setHeader('Content-Type', 'text/html')
        this.res.end(result)
      } else {
        // 模板文件不存在，渲染信息提示页
        this.res.render('message', {
          type: 'danger',
          reason: `找不到${template}`
        })
      }
    }

    /**
     * HTTP 错误处理
     * @param  {number} status HTTP状态码
     */
    http.ServerResponse.prototype.error = status => {
      this.res.statusCode = status
      this.res.render('message', {
        type: 'danger',
        status: status,
        reason: http.STATUS_CODES[status]
      })
    }

    /**
     * 重定向
     * @param  {string} path 跳转路径
     */
    http.ServerResponse.prototype.redirect = path => {
      this.res.statusCode = 302
      this.res.setHeader('Location', path)
      this.res.end()
    }

    /**
     * 发送json响应
     * @param  {object} obj 响应对象
     */
    http.ServerResponse.prototype.json = obj => {
      this.res.setHeader('Content-Type', 'application/json')
      this.end(JSON.stringify(obj))
    }
  }
}

/**
 * 模板引擎时间格式化 Helper，相当于 Vue 的 Filter
 */
Handlebars.registerHelper('datetime', (value, options) => {
  return moment(value * 1000).format('YYYY-MM-DD hh:mm:ss')
})
