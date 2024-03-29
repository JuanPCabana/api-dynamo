const Model = require('./model')

const addDocument = (document) => {
    const myDocument = new Model(document);
    return myDocument.save()
}

const multiAddDocuments = async (documents) => {

    return await Promise.all(documents.map(async (document) => {
        const myDoc = new Model(document)
        await myDoc.save()
    }))

}

const listAllDocuments = () => {

    return Model.find({}).populate([{ path: 'user' }, { path: 'from' }, { path: 'league' }, { path: 'category' }])

}
const listGlobalDocuments = () => {

    return Model.find({ global: true }).populate([{ path: 'user' }, { path: 'from' }, { path: 'league' }, { path: 'category' }])

}
const listUserDocs = (userId) => {
    let filter = { user: userId }
    return Model.find(filter).populate([{ path: 'user' }, { path: 'from' }, { path: 'league' }, { path: 'category' }])

}
const getOneItem = (id) => {
    let filter = { _id: id }
    return Model.findOne(filter).populate([{ path: 'user' }, { path: 'from' }, { path: 'league' }, { path: 'category' }])

}
const removeDocument = async (id) => {
    return await Model.findOneAndDelete({ _id: id })
}
const multiDelete = async (id) => {
    return await Model.deleteMany({user:id})
}

module.exports = {
    add: addDocument,
    multiAdd: multiAddDocuments,
    listAll: listAllDocuments,
    list: listUserDocs,
    listGlobal: listGlobalDocuments,
    find: getOneItem,
    delete: removeDocument,
    multiDelete
}