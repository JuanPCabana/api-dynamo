const Model = require('./model')

const addDocument = (document) => {
    const myDocument = new Model(document);
    return myDocument.save()
}

const multiAddDocuments = async (documents) => {

    return await Promise.all(documents.map((document) => {
        const myDoc = new Model(document)
        myDoc.save()
    }))

}

const listAllDocuments = () => {

    return Model.find({}).populate([{ path: 'user' }, { path: 'from' }])

}
const listGlobalDocuments = () => {

    return Model.find({ global: true }).populate([{ path: 'user' }, { path: 'from' }])

}
const listUserDocs = (userId) => {
    let filter = { user: userId }
    return Model.find(filter).populate([{ path: 'user' }, { path: 'from' }])

}

module.exports = {
    add: addDocument,
    multiAdd: multiAddDocuments,
    listAll: listAllDocuments,
    list: listUserDocs,
    listGlobal: listGlobalDocuments
}