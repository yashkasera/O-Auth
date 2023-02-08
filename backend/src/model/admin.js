const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const {NotFoundError, AuthenticationError} = require("../util/error");

const admin = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.length >= 8;
            }
        }
    },
    token: {
        type: String,
        required: true,
    },
    fcm_token: {
        type: String
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    role: {
        type: String,
        required: true,
    }
});


admin.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({email});
    if (!admin) {
        throw new NotFoundError('admin not found');
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new AuthenticationError('Invalid Password!');
    }
    return admin;
}

admin.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign({_id: admin._id.toString(), user_type: 'client'}, process.env.ACCESS_TOKEN);
    console.log(token);
    admin.token = token;
    await admin.save();
    return token;
}

admin.pre("save", async function (next) {
    const admin = this;
    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

admin.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();
    delete adminObject.password;
    delete adminObject.__v;
    return adminObject;
}

const Admin = mongoose.model('Admin', admin);
module.exports = Admin;