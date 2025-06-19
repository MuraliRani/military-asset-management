import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function seedAdmin() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    console.log('Admin user already exists.');
    process.exit(0);
  }
  const hash = await bcrypt.hash('admin123', 10);
  const admin = new User({ username: 'admin', password: hash, role: 'admin' });
  await admin.save();
  console.log('Admin user created: username=admin, password=admin123');
  process.exit(0);
}

seedAdmin(); 