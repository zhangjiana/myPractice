# 简单文章管理系统

> Nodejs + MySQL 实现的简单文章管理系统，可以添加、编辑、删除、查看、搜索文章，后端项目一般采用 MVC 架构，因为项目比较简单，这里只用到了V（views）和 C（controller），M（model） 层直接在 controller 里写了，复杂的项目 ，使用 MySQL 作为数据存储的话，可以使用 [sequelize](https://github.com/sequelize/sequelize) 作为 M 层。


## 演示地址
[http://liyahui.cn:1234](http://liyahui.cn:1234)
> 账号：admin 密码：nodejs


## 本地运行
``` bash
# 下载源码

# 安装依赖
npm install

# 启动 （localhost:1234）
node app.js
```

## 目录结构
```
│  app.js       // 入口文件
│  db.js        // 数据库配置/连接
│  server.js    // 简易 Web 服务器框架，类似 Express
│  
├─controller    // 控制器
├─middleware    // 中间件 
├─static        // 静态资源
└─views         // 模板
```