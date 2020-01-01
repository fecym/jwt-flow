const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

/**
 * @description {生成token}
 * @param {传入的数据} data
 */
const generateToken = data => {
  let privateKey = fs.readFileSync(
    path.resolve(__dirname, '../rsa_key/rsa_private_key.pem')
  )
  // 签发token，接受三个参数，载荷、私钥和一些配置
  return jwt.sign({data}, privateKey, {
    algorithm: 'RS256',
    // 过期时间设置为1天，可使用秒或表示时间跨度 zeit / ms 的字符串表示。
    expiresIn: '1d',
  })
}

/**
 * @description {校验token是否正确}
 * @param {获取到的 Bearer token} token
 */
const verifyToken = token => {
  if (!token) return false
  // 不要Bearer和空格，处理下token
  token = token.slice(7)
  const publicKey = fs.readFileSync(
    path.resolve(__dirname, '../rsa_key/rsa_public_key.pem')
  )
  let res = {}
  try {
    // 校验 token 会得到一个对象，其中 iat 是 token 创建时间，exp 是 token 到期时间
    const result = jwt.verify(token, publicKey, {algorithm: ['RE256']}) || {}
    const {exp} = result
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime <= exp) {
      res = result.data || {}
    }
    return res
  } catch (err) {
    return err
  }
}

module.exports = {
  generateToken,
  verifyToken,
}
