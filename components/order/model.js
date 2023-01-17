const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PaymentSchema = new Schema({
   method: { type: String },
   ref: { type: String },
   ammount: { type: Number },
})



const mySchema = new Schema({
   status: { type: String, default: "unpaid" },
   date: { type: Date, required: true },
   payment: { type: Object },
   ammount: { type: Schema.ObjectId, ref: 'Prices' },
   user: { type: Schema.ObjectId, ref: 'Users' }
})

const model = mongoose.model("Orders", mySchema)

module.exports = model