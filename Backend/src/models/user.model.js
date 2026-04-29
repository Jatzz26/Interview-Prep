const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
      name: {
            type: String,
            unique: [true,'Username must be unique'],
            required: true
      },
      email: {
            type: String,
            unique: [true,'Email must be unique'],
            required: true
      },
      password: {
            type: String,
            required: true
      },
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;