const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')

const addDocument = async ({
    name,
    description
}, user, file) => {


    if (!file || !name || !user) {

        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    const fileUrl = `http://localhost:${process.env.PORT}/app/files/` + file.filename

    const document = {
        file: fileUrl,
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