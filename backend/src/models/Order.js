import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  qty:   { type: Number, required: true, min: 1 },
}, { _id: false })

const orderSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerName:  { type: String, required: true },
  customerEmail: { type: String, default: '' },
  items:         { type: [orderItemSchema], required: true },
  subtotal:      { type: Number, required: true },
  vat:           { type: Number, required: true },
  total:         { type: Number, required: true },
  status: {
    type: String,
    enum: ['Confirmed', 'Preparing', 'Delivered', 'Cancelled'],
    default: 'Confirmed',
  },
  note: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
