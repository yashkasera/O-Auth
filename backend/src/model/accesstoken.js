const mongoose = require('mongoose');
const RefreshToken = require("./refreshtoken");

const accessToken = new mongoose.Schema({
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
    token: String,
    last_used: {
        type: Date,
        required: true,
        default: new Date(),
    }
}, {
    timestamps: true
});

accessToken.pre('save', async function (next) {
    const accessToken = this;
    const refreshToken = await RefreshToken.findOne({client: accessToken.client, user: accessToken.user})
    console.log(refreshToken);
    if (refreshToken.status === "revoked") {
        throw new Error("Refresh token is revoked!");
    }
    next()
})

accessToken.methods.toJSON = function () {
    const accessToken = this;
    const accessTokenObject = accessToken.toObject();
    delete accessTokenObject.__v;
    return accessTokenObject;
}

const AccessToken = mongoose.model('AccessToken', accessToken);

module.exports = AccessToken;