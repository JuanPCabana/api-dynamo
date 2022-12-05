const jwt = require('jsonwebtoken')

const secret = 'juan'


const verifyToken = (token, secret) =>{
    return jwt.sign(token,secret)
}