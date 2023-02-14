const store = require('./store')
const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const { s3Uploadv2, s3MultiUploadv2 } = require('../../awsS3')
const now = require('../../utils/helpers/now')

const addDocument = async ({
    name,
    description,
    user,
    group,
    global
}, tokenUser, file) => {
    console.log("🚀 ~ file: controller.js:14 ~ user", user)


    if (!file || !name || !tokenUser) {


        return Promise.reject(boom.badRequest('Datos erroneos!'))
    }

    var extension = file.originalname.slice(file.originalname.lastIndexOf('.'))
    var fileName = Date.now() + extension

    const groupObj = group ? JSON.parse(group) : null;

    const response = await s3Uploadv2(file, fileName)
    const document = group ? {
        file: response.Location,
        date: now(),
        name,
        description,
        league: groupObj.league,
        category: groupObj.category,
        user: user ?? tokenUser,
        from: tokenUser,
        global
    }
        :
        {
            file: response.Location,
            date: now(),
            name,
            description,
            user: user ?? tokenUser,
            from: tokenUser,
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
console.log("🚀 ~ file: controller.js:60 ~ files", files)


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
        const response = documentList.map(document => {
            const aux = document.toObject()
            delete aux?.user?.password
            delete aux?.from?.password
            return (aux)
        })
        return resolve(response)
    })

}
const listGlobalDocuments = () => {

    return new Promise(async (resolve, reject) => {
        const documentList = await store.listGlobal()
        const response = documentList.map(document => {
            const aux = document.toObject()
            delete aux?.user?.password
            delete aux?.from?.password
            return (aux)
        })
        return resolve(response)
    })

}


const listUserDocuments = (tokenUser, { user }) => {
    return new Promise(async (resolve, reject) => {

        if (!tokenUser.sub) {
            return reject(boom.badRequest('Id invalido'))
        }

        const userList = await store.list(user ? user : tokenUser.sub)
        const response = userList.map(document => {
            const aux = document.toObject()
            delete aux?.user?.password
            delete aux?.from?.password
            return (aux)
        })
        return resolve(response)


    })

}


module.exports = {
    add: addDocument,
    multiAdd: multiAddDocument,
    listAll: listAllDocuments,
    list: listUserDocuments,
    listGlobal: listGlobalDocuments
}