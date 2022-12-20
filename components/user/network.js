const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')
const { checkRoles } = require('../../middlewares/auth.handler')


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

router.patch('/', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    controller.update(req.body)
        .then((data) => {
            response.success(req, res, 200, { message: 'Usuario actualizado correctamente' })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/all', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    const queryData = { ...req.query, ...req.body }
    controller.list(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('admin', 'student', 'teacher'), (req, res, next) => {
    const userId = req.user.sub
    controller.get(userId)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

module.exports = router