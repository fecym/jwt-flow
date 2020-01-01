const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')

const privateKey = fs.readFileSync(
  path.resolve(__dirname, '../rsa_key/rsa_private_key.pem')
)

// 签发 token，这里使用 RS256算法

// jwt.sign 接受三个参数，载荷，私钥，其他配置

const payload = {username: 'cym'}

const tokenRS256 = jwt.sign(payload, privateKey, {
  algorithm: 'RS256',
  // 使用秒或表示时间跨度 zeit / ms 的字符串表示。
  expiresIn: '1d',
})

console.log('RS256 算法：', tokenRS256)

// 校验
const publicKey = fs.readFileSync(
  path.resolve(__dirname, '../rsa_key/rsa_public_key.pem')
)

// 接受两个个参数：要校验的 token，公钥。校验 token 会得到一个对象，其中 iat 是 token 创建时间，exp 是 token 到期时间
jwt.verify(tokenRS256, publicKey, (err, decoded) => {
  if (err) {
    return void console.log(err.message)
  }
  console.log(decoded)
})
