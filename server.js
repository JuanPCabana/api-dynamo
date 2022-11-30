if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')

const db = require('./db')

const router = require('./network/routes')

db(process.env.DB_URI)

var app = express()

//parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//agregando el api v1
const apiRouter = express.Router()
//se pasa la ruta y el router de arriba
app.use('/api/v1', apiRouter)

router(apiRouter)


app.use('/app', express.static('public'))

app.listen(3005)
console.log('Servidor corriendo en puerto 3005')