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
    controller.updateStatus(req.body)
        .then((data) => {
            response.success(req, res, 200, { message: 'Estatus de la orden actualizado correctamente', order: { ...data} })
        }).catch((err) => {
            next(err)
        });
})


router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    const queryData = {...req.query}
    controller.listAll(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            next(err)
        });
})

router.get('/user-payments', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    const queryData = { ...req.body, ...req.query }
    controller.list(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            next(err)
        });
})

module.exports = router