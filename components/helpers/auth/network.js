const express = require('express');
const router = express.Router()
const response = require('../../../network/response')
// const controller = require('./controller')
const boom = require('@hapi/boom')
const passport = require('passport')
const jwt = require('jsonwebtoken')


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



module.exports = router