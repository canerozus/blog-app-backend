const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    min: 4,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;