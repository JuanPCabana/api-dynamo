const express = require('express')
const user = require('../components/user/network')
const order = require('../components/order/network')
const auth = require('../components/helpers/auth/network')
const document = require('../components/documents/network')
const league = require('../components/league/network')
const price = require('../components/prices/network')


const routes = (server) => {
    server.use('/user', user)
    server.use('/order', order)
    server.use('/auth', auth)
    server.use('/document', document)
    server.use('/league', league)
    server.use('/price', price)
}

module.exports = routes