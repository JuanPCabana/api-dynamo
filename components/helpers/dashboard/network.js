const express = require('express');
const router = express.Router()
const response = require('../../../network/response')
const controller = require('./controller')
const boom = require('@hapi/boom')
const passport = require('passport')
const { checkRoles } = require('../../../middlewares/auth.handler');
const fs = require('fs')


router.get('/categories', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin', 'teacher'), (req, res, next) => {

    controller.categoriesInfo()
        .then((data) => {
            response.success(req, res, 200, { ...data })
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})
router.get('/perProductInfo', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin', 'teacher'), (req, res, next) => {

    controller.perProductInfo()
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})
router.get('/categories/:id', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin', 'teacher'), (req, res, next) => {

    controller.categoryInfo(req.params.id)
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

router.get('/perMonthInfo', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin', 'teacher'), (req, res, next) => {

    controller.perMonthInfo()
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})
router.get('/perMonthDebt', passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin', 'teacher'), (req, res, next) => {

    controller.perMonthDebt()
        .then((data) => {
            response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})

router.get('/downloadDebtors',/*  passport.authenticate('jwt', { session: false }), checkRoles('b9Admin', 'admin', 'teacher'), */ (req, res, next) => {

    controller.downloadDebtors()
        .then((data) => {
            res.setHeader('Content-Type', 'text/csv; charset=utf-8'); 
            res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');

            res.download('output.csv', 'data.csv', (err) => {
                if (err) {
                    console.error('Error al descargar el archivo CSV:', err);
                } else {
                    console.log('Archivo CSV descargado con éxito.');

                    fs.unlink('output.csv', (err) => {
                        if (err) {
                            console.error('Error al borrar el archivo CSV:', err);
                        } else {
                            console.log('Archivo CSV borrado con éxito.');
                        }
                    });
                }
            });

            // response.success(req, res, 200, data)
        }).catch((err) => {
            // response.error(req, res, 400, { message: 'algo fallo!', err })
            next(err)
        });
})


module.exports = router