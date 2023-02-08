const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const {NotFoundError, AuthenticationError} = require("../util/error");
const bcrypt = require('bcryptjs');
const user = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return validator.isMobilePhone(v);
            }
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 8;
            }
        }
    },
    fcm_token: {
        type: String
    },
    phone_token: String,
});

user.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;
    return userObject;
}

user.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.ACCESS_TOKEN);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

user.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

user.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email}).exec();
    if (!user) {
        throw new NotFoundError('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AuthenticationError('Invalid Password!');
    }
    return user;
}

const User = mongoose.model('User', user);
module.exports = User;