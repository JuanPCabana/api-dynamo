const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    league: { type: Schema.ObjectId, ref: 'Leagues' },
    category: { type: mongoose.ObjectId, required: false, ref: 'Categories' },
    position: { type: String, required: false },
    phone: { type: String, required: true },
    role: { type: String, required: false, default: 'student' },
    gender: { type: String, required: true },
    token: { type: Object },
    newStudent: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    verifiedEmail: { type: Boolean, default: false },
    nextPaymentDate: { type: String },
    avatar: { type: String },
    membership: { type: Schema.ObjectId, ref: 'Prices' },
    parent: { type: String },
    cardIssued: { type: Boolean, default: false }

})

const model = mongoose.model("Users", mySchema)

module.exports = model