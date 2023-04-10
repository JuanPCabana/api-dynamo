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

module.exports = {
    categoriesInfo,
    categoryInfo
}