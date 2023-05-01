const dashboardStore = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const sendMailService = require('../../../utils/mailer/index')
const { makeToken } = require('../../../utils/helpers/makeToken')

const categoriesInfo = async () => {

    const returnInfo = await dashboardStore.getCategoriesInfo()

    return returnInfo

}
const categoryInfo = async (id) => {

    const returnInfo = await dashboardStore.getCategoryInfo(id)

    return returnInfo

}

const perProductInfo = async () =>{
    const returnInfo = await dashboardStore.perProductInfo()

    return returnInfo
}

const perMonthInfo = async () =>{
    const returnInfo = await dashboardStore.perMonthInfo()

    return returnInfo
}

module.exports = {
    categoriesInfo,
    categoryInfo,
    perProductInfo,
    perMonthInfo
}