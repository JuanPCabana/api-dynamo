const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
   file: {type: String, required: true},
   name: {type: String, required: true},
   description: {type: String, required: false},
   user: {type: Schema.ObjectId, ref: 'Users'}
})

const model = mongoose.model("Documents", mySchema)

module.exports = model