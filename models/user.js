const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String }, // Agregamos el campo del teléfono
  isAdmin: { type: Boolean, default: false },
  isAuthorized: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
