const dashboardStore = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const sendMailService = require('../../../utils/mailer/index')
const { makeToken } = require('../../../utils/helpers/makeToken')
const { createObjectCsvWriter } = require('csv-writer');
const { stringToUtf8 } = require('../../../utils/helpers/stringToUtf8')


const categoriesInfo = async () => {

    const returnInfo = await dashboardStore.getCategoriesInfo()

    return returnInfo

}
const categoryInfo = async (id) => {

    const returnInfo = await dashboardStore.getCategoryInfo(id)

    return returnInfo

}

const perProductInfo = async () => {
    const returnInfo = await dashboardStore.perProductInfo()

    return returnInfo
}

const perMonthInfo = async () => {
    const returnInfo = await dashboardStore.perMonthInfo()

    return returnInfo
}
const perMonthDebt = async () => {
    const returnInfo = await dashboardStore.perMonthDebt()

    return returnInfo
}
const downloadDebtors = async () => {
    const returnInfo = await dashboardStore.downloadDebtors()

    const csvWriter = createObjectCsvWriter({
        path: 'output.csv',
        header: [
            { id: 'firstName', title: 'Nombre' },
            { id: 'lastName', title: 'Apellido' },
            { id: 'league', title: 'Liga' },
            { id: 'category', title: 'Categoria' },
            { id: 'phone', title: 'Telefono' },
            { id: 'membership', title: 'Membresia' },
            { id: 'membershipPrice', title: 'Precio mensualidad' },
            { id: 'totalDebt', title: 'Deuda total' },
        ],
        encoding: 'utf-8'
    });

    const encodedData = stringToUtf8(returnInfo.docs)

    await csvWriter.writeRecords(encodedData)
        .catch(err => {
            console.error('Error al escribir el archivo CSV:', err);
            boom.internal('Error inesperado')
        });

    return returnInfo
}

module.exports = {
    categoriesInfo,
    categoryInfo,
    perProductInfo,
    perMonthInfo,
    perMonthDebt,
    downloadDebtors
}