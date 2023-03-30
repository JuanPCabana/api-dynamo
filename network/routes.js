const express = require('express')
const user = require('../components/user/network')
const order = require('../components/order/network')
const auth = require('../components/helpers/auth/network')
const document = require('../components/documents/network')
const league = require('../components/league/network')
const price = require('../components/prices/network')
const dolar = require('../components/dolar/network')
const dashboard = require('../components/helpers/dashboard/network')

const routes = (server) => {
    server.use('/user', user)
    server.use('/order', order)
    server.use('/auth', auth)
    server.use('/document', document)
    server.use('/league', league)
    server.use('/price', price)
    server.use('/dolar', dolar)
    server.use('/dashboard', dashboard)
}

module.exports = routes