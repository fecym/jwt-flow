const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const {exec} = require('child_process')
const PORT = 3002
const app = express()

const {verifyToken, generateToken} = require('./utils')

// 不需要校验token的白名单
const whiteList = ['/', '/login', '/favicon.ico', '/jquery.min.js']

const dealToken = (req, res, next) => {
  // 处理不需要校验的 token 接口地址
  if (whiteList.includes(req.url)) {
    return next()
  } else {
    // 从请求头的 authorization 中获取 Bearer Token
    const authorization = req.headers['authorization']
    const result = verifyToken(authorization)
    console.log(result, 'result')
    if (!authorization) {
      return res.status(401).json({
        code: 401,
        msg: 'Error',
        data: '未捕获到您的token',
      })
    } else if (result.name && result.name.includes('Error')) {
      return res.status(401).json({
        code: 401,
        msg: 'Error',
        data: {
          msg: 'token校验失败',
          info: result.message,
        },
      })
    } else {
      // 向后传递消息
      req.uid = verifyToken(authorization)['uid']
      // 查一次库，确保该 token 用户存在
      return next()
    }
  }
}

// 处理 token 校验
app.use(dealToken)

// 处理 post 请求
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 登录路由
app.post('/login', (req, res) => {
  // 这里就不做SQL查库逻辑了，直接定死固定账户密码
  const {username, password} = req.body
  if (username === 'admin' && password === '123123') {
    // 登录成功，设置token返回给前端，这里要与上面保持一致
    const token = generateToken({uid: 'admin'})
    res.status(200).json({
      msg: 'ok',
      data: {token, username},
    })
  } else {
    res.status(400).json({
      msg: 'error',
      data: '参数校验失败',
    })
  }
})

// 用户中心路由
app.get('/profile', (req, res) => {
  // 在这里我们可以获取到 uid，如果获取不到说明 没有 token，因为我们全局处理了 token
  res.status(200).json({
    msg: 'ok',
    data: {username: req.uid},
  })
})

// 处理静态文件夹
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  // 开启一个子线程打开浏览器
  exec(`start http://localhost:${PORT}`)
})
