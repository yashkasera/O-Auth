const mongoose = require('mongoose');

const refreshToken = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    status:{
        type: String,
        required: true,
        default: 'active',
        enum: ['active', 'revoked']
    },
    token: String,
}, {
    timestamps: true
});

refreshToken.methods.toJSON = function () {
    const refreshToken = this;
    const refreshTokenObject = refreshToken.toObject();
    delete refreshTokenObject.__v;
    return refreshTokenObject;
}

const RefreshToken = mongoose.model('RefreshToken', refreshToken);

module.exports = RefreshToken;