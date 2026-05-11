import mongoose from 'mongoose'

const feedbackSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    role:      { type: String, default: 'Customer' },
    rating:    { type: Number, required: true, min: 1, max: 5 },
    text:      { type: String, required: true },
    approved:  { type: Boolean, default: false },
    email:     { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Feedback', feedbackSchema)
