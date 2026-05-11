// Run this ONCE to create the admin account:
//   cd backend && npm run seed

import 'dotenv/config'
import mongoose from 'mongoose'
import Admin from './models/Admin.js'

await mongoose.connect(process.env.MONGODB_URI)
console.log('✅ Connected to MongoDB')

const existing = await Admin.findOne({ email: 'admin@crispyhub.ae' })
if (existing) {
  console.log('ℹ️  Admin already exists — no changes made.')
} else {
  await Admin.create({
    name:     'Admin',
    email:    'admin@crispyhub.ae',
    password: 'admin123',
    role:     'superadmin',
  })
  console.log('✅ Admin created!')
  console.log('   Email:    admin@crispyhub.ae')
  console.log('   Password: admin123')
  console.log('   ⚠️  Change this password after first login!')
}

await mongoose.disconnect()
process.exit(0)
