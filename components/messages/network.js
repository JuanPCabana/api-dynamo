const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')


router.get('/', (req, res) => {
    console.log(req.headers)
    console.log(req.query)
    res.header({
        "custom-header": "Juan Header"
    })
    // res.send('lista mensajes')
    response.success(req, res, 200, { docs: 'Lista de mensajes' })
})

router.post('/', (req, res) => {
    const { body } = req

    controller.addMessage(body.user, body.message)
        .then((fullmessage) => {
            response.success(req, res, 201, { message: fullmessage })
        })
        .catch(() => {
            response.error(req, res, 400, { message: 'Error insesperado' }, { message: 'Error en datos' })
        })

})

module.exports = router