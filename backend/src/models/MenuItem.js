import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true, min: 0 },
    category:    {
      type:     String,
      required: true,
      enum:     ['burgers', 'sandwiches', 'falooda', 'icecream', 'potato', 'beverages'],
    },
    image:       { type: String, default: '' },
    tag:         { type: String, default: '' },
    popular:     { type: Boolean, default: false },
    available:   { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('MenuItem', menuItemSchema)
