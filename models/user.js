const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'supervisor', 'user'], default: 'user' },
  isAuthorized: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
