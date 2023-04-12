const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PaymentSchema = new Schema({
   method: { type: String },
   ref: { type: String },
   ammount: { type: Number },
})



const mySchema = new Schema({
   status: { type: String, default: "unpaid", required: true },
   date: { type: Date, required: true },
   payment: { type: Object },
   inscription: { type: Boolean, default: false },
   ammount: { type: Schema.ObjectId, ref: 'Prices', required: true },
   user: { type: Schema.ObjectId, ref: 'Users', required: true },
   managedBy: { type: Schema.Types.ObjectId, ref: 'Users', required: false },
   expired: { type: Boolean, default: false }
})

const model = mongoose.model("Orders", mySchema)

module.exports = model