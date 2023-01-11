const express = require('express');
const router = express.Router()
const response = require('../../../network/response')
const userController = require('./controller')
const boom = require('@hapi/boom')
const passport = require('passport')
const jwt = require('jsonwebtoken');
const { checkRoles } = require('../../../middlewares/auth.handler');


router.post('/login', passport.authenticate('local', { session: false }), (req, res, next) => {

    try {

        const user = req.user
        const payload = {
            sub: user._id,
            role: user.role
        }

        const secret = process.env.JWT_SECRET

        const token = jwt.sign(payload, secret)
        //eliminar password
        const retUser = user.toObject()
        delete retUser.password
        //
        res.json({ retUser, token })
    } catch (error) {
        next(error)
    }

    /* controller.add(req.body)
        .then((data) => {
            delete data._doc.password
            response.success(req, res, 200, { message: 'Creado correctamente', user: { ...data._doc } })
        }).catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        }); */
})

router.get('/recoverPassword', passport.authenticate('jwt', { session: false }), checkRoles('admin', 'student'), (req, res, next) => {
    const userId = req.user.sub
    
    userController.recoverToken(userId)
        .then((data) => {
            response.success(req, res, 200, { message: 'Usuario validado correctamente' })
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

router.post('/resetPassword', passport.authenticate('jwt', { session: false }), checkRoles('admin', 'student'), (req, res, next) => {
    const userId = req.user.sub
    const token = req.body.token
    const password = req.body.password
    
    userController.reset(userId, token, password)
        .then((data) => {
            response.success(req, res, 200, { message: 'Contraseña modificada correctamente' })
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})



module.exports = router