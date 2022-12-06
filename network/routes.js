const express = require('express')
const user = require('../components/user/network')
const payment = require('../components/payment/network')
const auth = require('../components/helpers/auth/network')
const document = require('../components/documents/network')
const league = require('../components/league/network')


const routes = (server) => {
    server.use('/user', user)
    server.use('/payment', payment)
    server.use('/auth', auth)
    server.use('/document', document)
    server.use('/league', league)
}

module.exports = routes