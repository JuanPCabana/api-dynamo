const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const {s3Uploadv2} = require('../../awsS3')

const addDocument = async ({
    name,
    description
}, user, file) => {


    if (!file || !name || !user) {
    

        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    var  extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    var fileName = Date.now()+extension

    const response = await s3Uploadv2(file, fileName)
    const document = {
        file: response.Location,
        name,
        description,
        user
    }

    return store.add(document)

}

const listAllDocuments = () => {

    return new Promise(async (resolve, reject) => {
        const documentList = await store.listAll()

        return resolve(documentList)
    })

}


const listUserDocuments = (user) => {
    return new Promise(async (resolve, reject) => {

        console.log("🚀 ~ file: controller.js:44 ~ returnnewPromise ~ user.sub", user.sub)
        if (!user.sub) {
            return reject(boom.badRequest('Id invalido'))
        }

        const userList = await store.list(user.sub)

        return resolve(userList)
    })

}


module.exports = {
    add: addDocument,
    listAll: listAllDocuments,
    list: listUserDocuments
}