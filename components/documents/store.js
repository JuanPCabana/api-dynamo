const Model = require('./model')

const addDocument = (document) => {
    const myDocument = new Model(document);
    return myDocument.save()
}

const listAllDocuments = () => {
   
    return Model.find({})

}
const listUserDocs = (userId) => {
    let filter = { user: userId }
    return Model.find(filter).populate('user')

}

module.exports = {
    add: addDocument,
    listAll: listAllDocuments,
    list: listUserDocs
}