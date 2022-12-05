const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
   method: {type: String, required: true},
   ref: {type: String, required: true},
   ammount: {type: Number, required: true},
   user: {type: Schema.ObjectId, ref: 'Users'}
})

const model = mongoose.model("Payments", mySchema)

module.exports = model