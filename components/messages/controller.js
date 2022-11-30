


const addMessage = (user, message) => {
    return new Promise((resolve, reject) => {

        if(!user || !message) {
            console.error('Falta usuario o mensaje')
            return reject('Los datos no son correctos')
        }
        const fullMessage = {
            user: user,
            message: message,
            date: new Date()
        }
        console.log(fullMessage);
        resolve(fullMessage)

    })

}

module.exports = {
    addMessage,
}