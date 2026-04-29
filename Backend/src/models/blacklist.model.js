const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
      token: {
            type: String,
            required: true
      }
}, {timestamps: true});

const blacklistModel = mongoose.model('BlacklistTokens', blacklistTokenSchema);

module.exports = blacklistModel;