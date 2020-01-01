const jwt = require('jsonwebtoken')

// 载荷：除去协议首部之外实际传输的数据
const payload = {
  name: 'cym'
}

// 秘钥
const secret = 'CHENGYUMING'

// 签发 token
const token = jwt.sign(payload, secret, { expiresIn: '1day' })

console.log(token)

// 校验 token

jwt.verify(token, secret, (err, data) => {
  if (err) {
    console.log(err.message)
    return
  }
  console.log(data)
})