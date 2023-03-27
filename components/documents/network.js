const express = require('express');
const router = express.Router()
const response = require('../../network/response')
const controller = require('./controller')
const { checkApiKey, checkRoles } = require('../../middlewares/auth.handler')
const boom = require('@hapi/boom')
const passport = require('passport')

const upload = require('../../middlewares/multer.handler')

//post pdf file
router.post('/', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'student', 'admin'), upload.single('file'), (req, res, next) => {

    controller.add(req.body, req.user.sub, req.file)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente', fileInfo: { ...data._doc } })
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'student', 'admin'), (req, res, next) => {

    controller.list(req.user, req.query)
        .then((data) => {
            response.success(req, res, 200, data)
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/all', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'student', 'admin'), (req, res, next) => {

    controller.listAll()
        .then((data) => {
            response.success(req, res, 200, data)
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.get('/global', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'student', 'admin'), (req, res, next) => {

    controller.listGlobal()
        .then((data) => {
            response.success(req, res, 200, data)
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.post('/multi', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'student', 'admin'), upload.array('file'), (req, res, next) => {

    controller.multiAdd(req.body, req.user.sub, req.files)
        .then((data) => {
            response.success(req, res, 200, { message: 'Documentos Cargados', fileInfo: { ...data._doc } })
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

router.delete('/:id', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'student', 'admin'), (req, res, next) => {

    controller.delete(req.params, req.user.sub)
        .then((data) => {
            response.success(req, res, 200, { message: 'Creado correctamente', fileInfo: { ...data._doc } })
        })
        .catch((err) => {
            // response.error(req, res, 500, { message: 'Error inesperado' }, err)
            next(err)
        });
})

module.exports = router