const randomString = require('./random-string')
const buildMakeToken = require('./generate-token')


const makeToken = buildMakeToken({ randomString });

module.exports = { makeToken }