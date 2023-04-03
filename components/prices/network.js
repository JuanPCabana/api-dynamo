const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey, checkRoles } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')


router.post('/', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin'), (req, res, next) => {
    controller.add(req.body)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente', price: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.patch('/:id', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin'), (req, res, next) => {
    controller.update(req.params.id, req.body)
        .then((data) => {
            console.log("🚀 ~ file: network.js:23 ~ .then ~ data:", data)
            response.success(req, res, 200, { message: 'Precio modificado correctamente', /* price: { ...data._doc } */ })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})
router.delete('/:id', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin'), (req, res, next) => {
    controller.delete(req.params.id)
        .then((data) => {
            response.success(req, res, 200, { message: 'Precio eliminado correctamente', deletedPrice: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/', (req, res, next) => {

    controller.listAll()
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

router.get('/:id', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin', 'student'), (req, res, next) => {
    controller.getOne(req.params.id)
        .then((data) => {
            response.success(req, res, 200, { price: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})


module.exports = router