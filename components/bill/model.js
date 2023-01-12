const mongoose = require('mongoose')

const Schema = mongoose.Schema

const mySchema = new Schema({
   status: { type: String, default: "pendding" },
   date: { type: Date, required: true },
   payment: {type: Schema.Types.ObjectId},
   ammount: {type: Number, required: true},
   user: {type: Schema.ObjectId, ref: 'Users'}
})

const model = mongoose.model("Bills", mySchema)

module.exports = model