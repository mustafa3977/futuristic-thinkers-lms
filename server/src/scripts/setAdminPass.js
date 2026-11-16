import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import { User } from '../models/index.js';

async function setAdminPassword() {
  await connectDB();
  const password = 'AdminSecure2026!#';
  const newHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email: 'admin@example.com' },
    { $set: { passwordHash: newHash, isActive: true, role: 'admin' } },
    { new: true, upsert: true }
  );
  console.log('Admin user ready:');
  console.log('Username / Email:', user.email);
  console.log('Password:', password);
  console.log('Role:', user.role);
  await mongoose.disconnect();
}

setAdminPassword().catch((err) => {
  console.error(err);
  process.exit(1);
});

