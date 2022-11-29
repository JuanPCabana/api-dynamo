const express = require('express')
const bodyParser = require('body-parser')

const router = require('./network/routes')

var app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
router(app)


app.use('/app', express.static('public'))

app.listen(3005)
console.log('Servidor corriendo en puerto 3005')