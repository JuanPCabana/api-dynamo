const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
    email: { type: String, required: true },
    additionalEmail: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    birthDate: { type: Date, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    league: { type: String, required: true },
    category: { type: String, required: true },
    position: { type: String, required: true },
    phone: { type: String, required: true },
    username: { type: String, required: true },
    role: { type: String, required: false, default: 'student' }
})

const model = mongoose.model("Users", mySchema)

module.exports = model