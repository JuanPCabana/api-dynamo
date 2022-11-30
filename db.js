const db = require('mongoose')

db.Promise = global.Promise

//'mongodb+srv://juanpcabana:Crackface99..@testingcluster.xkhgagl.mongodb.net/ChatApi?retryWrites=true&w=majority'

const connect = async (url) => {
    await db.connect(url, { useNewUrlParser: 'true' })

    console.log('[DB] Conectada correctamente');

}

module.exports = connect