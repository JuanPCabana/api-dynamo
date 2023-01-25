const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')
const { checkRoles } = require('../../middlewares/auth.handler');
const upload = require('../../middlewares/multer.handler');

//add user
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

//update users
router.patch('/', passport.authenticate('jwt', { session: false }), checkRoles('admin', 'student'), (req, res, next) => {
    controller.update(req.body)
        .then((data) => {
            response.success(req, res, 200, { message: 'Usuario actualizado correctamente' })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

//get all users
router.get('/all', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    const queryData = { ...req.query, ...req.body }
    controller.list(queryData)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

//get current user
router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('admin', 'student', 'teacher'), (req, res, next) => {
    const userId = req.user.sub
    controller.get(userId)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

//get User
router.get('/:id', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    const userId = req.params.id
    controller.getById(userId)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

// verificacion de correo
router.post('/validateEmail', (req, res, next) => {
    const token = req.query.token
    const userId = req.query.id
    controller.validate(userId, token)
        .then((data) => {
            response.success(req, res, 200, { message: 'Usuario validado correctamente' })
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

//Cambio de status (solvente : no solvente)
router.post('/:id/status', passport.authenticate('jwt', { session: false }), checkRoles('admin'), (req, res, next) => {
    const userId = req.params.id
    const newStatus = req.body.status
    controller.statusChange(userId, newStatus)
        .then((data) => {
            response.success(req, res, 200, { message: 'Cambio de estatus realizado correctamente' })
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

//post avatar
router.post('/avatar', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), upload.single('file'), (req, res, next) => {
    controller.addAvatar(req.user.sub, req.file)
        .then((data) => {
            response.success(req, res, 200, { message: 'Avatar cargado correctamente' })
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

module.exports = router