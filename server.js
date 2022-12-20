if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const { PORT } = require('./config')
const bodyParser = require('body-parser')

const db = require('./db')

const router = require('./network/routes')

const { errorHandler, errorLogger, boomErrorHandler } = require('./middlewares/error.handler')


db(process.env.DB_URI)

var app = express()
var cors = require('cors');
app.use(cors());

require('./utils/auth')

//parsers
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
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

app.listen(PORT)
console.log('Servidor corriendo en puerto ', PORT)