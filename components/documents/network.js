const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey, checkRoles } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')

const upload = require('../../middlewares/multer.handler')

router.post('/', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), upload.single('file'), (req, res, next) => {

    controller.add(req.body, req.user.sub, req.file)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente', fileInfo: { ...data._doc } })
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), (req, res, next) => {

    controller.list(req.user)
        .then((data) => {
            response.success(req, res, 200, data )
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/all', passport.authenticate('jwt', { session: false }), checkRoles('student', 'admin'), (req, res, next) => {

    controller.listAll()
        .then((data) => {
            response.success(req, res, 200, data )
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})



module.exports = router