const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')


router.post('/', (req, res, next) => {
    controller.add(req.body)
        .then((data) => {
            delete data._doc.password
            response.success(req, res, 200, { message: 'Creado correctamente', user: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/', checkApiKey, passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const queryData = { ...req.query, ...req.body }
    controller.list(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

module.exports = router