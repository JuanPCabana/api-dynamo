const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')


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

router.get('/', checkApiKey, (req, res) => {
    controller.list(req.query.id)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            response.error(req, res, 400, { message: 'algo fallo!', err })
        });
})

module.exports = router