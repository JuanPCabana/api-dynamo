const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')


router.get('/', (req, res) => {
    const filterMessages = req.query.user || null
    controller.getMessages(filterMessages)
        .then((messages) => {
            response.success(req, res, 200, messages)
        })
        .catch((err) => {
            response.error(req, res, 500, { message: 'Error insesperado' }, { message: err })
        })
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

router.patch('/:id', (req, res) => {

    controller.updateMessage(req.params.id, req.body.text)
        .then((data) => {
            response.success(req, res, 200, data)
        })
        .catch((err) => {
            response.error(req, res, 400, { message: 'Error insesperado' }, { message: err })
        })

})

module.exports = router