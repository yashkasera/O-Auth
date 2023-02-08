const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {NotFoundError, AuthenticationError} = require("../util/error");

const client = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    client_secret: {
        type: String,
        required: true,
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    callback_url_1: {
        type: String,
        required: true
    },
    callback_url_2: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});


client.methods.toJSON = function () {
    const client = this;
    const clientObject = client.toObject();
    delete clientObject.password;
    delete clientObject.client_secret;
    delete clientObject.__v;
    return clientObject;
}

client.pre('save', async function (next) {
    const client = this;
    if (client.isModified('password')) {
        client.password = await bcrypt.hash(client.password, 8);
    }
    next();
});

client.statics.findByCredentials = async (email, password) => {
    const client = await Client.findOne({email});
    if (!client) {
        throw new NotFoundError('Client not found');
    }
    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
        throw new AuthenticationError('Invalid Password!');
    }
    return client;
}

client.methods.findByToken = async function (token) {
    const client = this;
    const tokenObject = client.tokens.find((t) => t.token === token && t.client === client);
    if (!tokenObject) {
        throw new AuthenticationError('Invalid token');
    }
    if (tokenObject.expiry < Date.now()) {
        throw new AuthenticationError('Token expired');
    }
    return tokenObject;
}

const Client = mongoose.model('Client', client);
module.exports = Client;