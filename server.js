if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')

const db = require('./db')

const router = require('./network/routes')

const { errorHandler, errorLogger, boomErrorHandler } = require('./middlewares/error.handler')


db(process.env.DB_URI)

var app = express()
const cors = require("cors");



//parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
//agregando el api v1
const apiRouter = express.Router()
//se pasa la ruta y el router de arriba
app.use('/api/v1', apiRouter)

router(apiRouter)

//boom errors
app.use(errorLogger)
app.use(boomErrorHandler)
app.use(errorHandler)

app.use('/app', express.static('public'))

app.listen(3005)
console.log('Servidor corriendo en puerto 3005')