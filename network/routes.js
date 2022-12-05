const express = require('express')
const user = require('../components/user/network')
const payment = require('../components/payment/network')
const auth = require('../components/helpers/auth/network')


const routes = (server) => {
    server.use('/user', user)
    server.use('/payment', payment)
    server.use('/auth', auth)
}

module.exports = routes