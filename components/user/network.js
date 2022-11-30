const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')

router.post('/', (req, res) => {
    controller.add(req.body.name)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente' })
        }).catch((err) => {
            response.error(req, res, 500, { message: 'Error inesperado' }, err)
        });
})

router.get('/', (req, res) => {
    controller.list(req.query.id)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            response.error(req, res, 400, { message: 'algo fallo!', err })
        });
})

module.exports = router