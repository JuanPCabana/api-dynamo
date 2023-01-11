const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const { s3Uploadv2, s3MultiUploadv2 } = require('../../awsS3')

const addDocument = async ({
    name,
    description,
    league,
    category,
    user:bodyUser,
    global
}, user, file) => {


    if (!file || !name || !user) {


        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    var extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    var fileName = Date.now() + extension

    const response = await s3Uploadv2(file, fileName)
    const document = {
        file: response.Location,
        name,
        description,
        league,
        category,
        user: bodyUser? bodyUser : user,
        global
    }

    return store.add(document)

}
const multiAddDocument = async ({
    name,
    description,
    league,
    category,
}, user, files) => {


    if (files.lenght > 0 || !name || !user) {


        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    /* var documentList = files.map(async (file, idx) => {
       
        const response = await s3Uploadv2(file, fileName)
       
        return document
    }) */
    const results = await s3MultiUploadv2(files)
    const documents = results.map((result) => {
        return {
            file: result.Location,
            name: result.key,
            description,
            league,
            category,
            user
        }
    })

    return await store.multiAdd(documents)

}

const listAllDocuments = () => {

    return new Promise(async (resolve, reject) => {
        const documentList = await store.listAll()

        return resolve(documentList)
    })

}
const listGlobalDocuments = () => {

    return new Promise(async (resolve, reject) => {
        const documentList = await store.listGlobal()
        const responseDocumentList = []
        documentList.map(document =>{
            const aux = document.toObject()
            delete aux.user.password
            responseDocumentList.push(aux)
        })
        return resolve(responseDocumentList)
    })

}


const listUserDocuments = (user) => {
    return new Promise(async (resolve, reject) => {

        console.log("🚀 ~ file: controller.js:44 ~ returnnewPromise ~ user.sub", user.sub)
        if (!user.sub) {
            return reject(boom.badRequest('Id invalido'))
        }

        const userList = await store.list(user.sub)
        const responseDocumentList = []
        userList.map(document =>{
            const aux = document.toObject()
            delete aux.user.password
            responseDocumentList.push(aux)
        })
        return resolve(responseDocumentList)


    })

}


module.exports = {
    add: addDocument,
    multiAdd: multiAddDocument,
    listAll: listAllDocuments,
    list: listUserDocuments,
    listGlobal: listGlobalDocuments
}