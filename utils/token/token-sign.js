const jwt = require('jsonwebtoken')

const secret = 'juan'
const payload = {
    sub: 1,
    role: 'student'
}


const signToken = (payload, secret) =>{
    return jwt.sign(payload,secret)
}