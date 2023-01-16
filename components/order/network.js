const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey, checkRoles } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')


router.post('/', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), (req, res, next) => {
    controller.add(req.body)
        .then((data) => {
            // console.log("🚀 ~ file: network.js:13 ~ .then ~ data", data)
            response.success(req, res, 200, { message: 'Creado correctamente', order: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.post('/payment', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), (req, res, next) => {
    controller.addPayment(req.body)
        .then((data) => {
            // console.log("🚀 ~ file: network.js:13 ~ .then ~ data", data)
            response.success(req, res, 200, { message: 'Creado correctamente', order: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {

    controller.listAll()
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

router.get('/user-payments', checkApiKey, passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const queryData = { ...req.user }
    controller.list(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

module.exports = router