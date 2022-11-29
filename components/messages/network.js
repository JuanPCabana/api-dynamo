const express = require('express');
const router = express.Router()
const response = require('../../network/response')


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
    console.log(req.body)
    if (req.query.error === "ok") {
        response.error(req, res, 500, { message: 'Error insesperado' }, { message: 'Error Simulado' } )
    }
    else {

        res.send('agregado mensaje')
    }
})

module.exports = router