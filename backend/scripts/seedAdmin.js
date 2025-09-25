import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

async function run() {
  try {
    await connectDB()
    const email = process.env.ADMIN_EMAIL || 'admin@civiclens.local'
    const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    const name = process.env.ADMIN_NAME || 'CivicLens Admin'

    let user = await User.findOne({ email })
    if (user) {
      user.role = 'admin'
      if (!user.password) user.password = password
      await user.save()
      console.log('Updated existing user to admin:', email)
    } else {
      user = await User.create({ name, email, password, role: 'admin' })
      console.log('Created admin user:', email)
    }
  } catch (e) {
    console.error('Seeding failed', e)
  } finally {
    await mongoose.connection.close()
    process.exit(0)
  }
}

run()


