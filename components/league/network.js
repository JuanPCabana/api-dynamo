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
            response.success(req, res, 200, { message: 'Creado correctamente', user: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})
router.post('/category', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin'), (req, res, next) => {
    controller.addCategory(req.body)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente', user: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})
router.get('/category', (req, res, next) => {

    const league = req.query.id

    controller.listCategories(league)
        .then((data) => {
            response.success(req, res, 200, { categories: data  })
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

router.get('/:id', (req, res, next) => {
    const queryData = req.params.id
    controller.get(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

module.exports = router