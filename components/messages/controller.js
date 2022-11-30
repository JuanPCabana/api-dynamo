const store = require('./store')


const addMessage = (user, message) => {
    return new Promise((resolve, reject) => {

        if (!user || !message) {
            console.error('Falta usuario o mensaje')
            return reject('Los datos no son correctos')
        }
        const fullMessage = {
            user: user,
            message: message,
            date: new Date()
        }
        store.add(fullMessage);
        resolve(fullMessage)

    })

}

const getMessages = (filterUser) => {
    return new Promise((resolve, reject) => {
        resolve(store.list(filterUser))
    })
}

const updateMessage = (id, message) => {
    return new Promise(async (resolve, reject) => {
        if (!id || !message) {
            return reject('Invalid data')
        }

        const result = await store.updateText(id, message)
        resolve(result)
    })
}

module.exports = {
    addMessage,
    getMessages,
    updateMessage
}