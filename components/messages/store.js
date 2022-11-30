const db = require('mongoose')
const Model = require('./model')

//mongodb+srv://juanpcabana:Crackface99.@testingcluster.xkhgagl.mongodb.net/?retryWrites=true&w=majority

db.Promise = global.Promise
db.connect('mongodb+srv://juanpcabana:Crackface99..@testingcluster.xkhgagl.mongodb.net/ChatApi?retryWrites=true&w=majority', { useNewUrlParser: 'true' })

console.log('[DB] Conectada correctamente');

const addMessage = (message) => {
    const myMessage = new Model(message)
    myMessage.save()
}

const getMessages = async (filterUser) => {
    let filter = {}
    if (filterUser !== null) {
        filter = { user: filterUser }
    }
    const messages = await Model.find(filter)
    return messages

}

const updateText = async (id, message) => {
    const foundMessage = await Model.findOne({
        _id: id
    })

    foundMessage.message = message
    const newMessage = await foundMessage.save()

    return newMessage

}

module.exports = {
    add: addMessage,
    list: getMessages,
    updateText: updateText
}