const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey, checkRoles } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')

// create order
router.post('/', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), (req, res, next) => {
    controller.add(req.body)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente', order: { ...data._doc } })
        }).catch((err) => {
            next(err)
        });
})

// generate month order to user
router.post('/generate', passport.authenticate('jwt', { session: false }), checkRoles( 'admin'), (req, res, next) => {
    controller.generate(req.body, req.user)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente', order: { ...data._doc } })
        }).catch((err) => {
            next(err)
        });
})

//add payment info
router.post('/payment', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), (req, res, next) => {
    controller.addPayment(req.body)
        .then((data) => {
            response.success(req, res, 200, { message: 'Información de pago agregada correctamente', order: { ...data } })
        }).catch((err) => {
            next(err)
        });
})

//change order status
router.post('/status', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    controller.updateStatus(req.body, req.user)
        .then((data) => {
            response.success(req, res, 200, { message: 'Estatus de la orden actualizado correctamente', order: { ...data } })
        }).catch((err) => {
            next(err)
        });
})

//get all orders
router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    const queryData = { ...req.query }
    controller.listAll(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            next(err)
        });
})
//get user orders
router.get('/user-payments', passport.authenticate('jwt', { session: false }), checkRoles('admin', 'student'), (req, res, next) => {
    const queryData = { ...req.body, ...req.query }
    const tokenUser = req.user
    controller.list(queryData, tokenUser)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            next(err)
        });
})

module.exports = router