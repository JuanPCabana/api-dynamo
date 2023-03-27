const express = require('express');
const router = express.Router()
const response = require('../../../network/response')
const controller = require('./controller')
const boom = require('@hapi/boom')
const passport = require('passport')
const { checkRoles } = require('../../../middlewares/auth.handler');


router.get('/categories', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin'), (req, res, next) => {

    controller.categoriesInfo()
        .then((data) => {
            response.success(req, res, 200, { body: { ...data } })
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})




module.exports = router