const {NotFoundError, AuthenticationError} = require("../util/error");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Admin = require("../model/admin");
const AccessToken = require("../model/accesstoken");

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.access_token || req.header("Authorization");
        if (!token) {
            throw new AuthenticationError("Token not found");
        }
        console.log(token);
        const {_id, user_type} = jwt.verify(token, process.env.ACCESS_TOKEN);
        console.log(_id, user_type);
        if (user_type === 'user') {
            const user = await User.findOne({_id})
            const access_token = await AccessToken.findOne({user: user._id, token})
            if (!user || !access_token) {
                res.cookie('access_token', '', {maxAge: 0});
                throw new AuthenticationError("Access token not found!")
            }
            access_token.last_used = new Date();
            await access_token.save();
            res.cookie("access_token", access_token.token, {httpOnly: true, maxAge: 1000 * 60 * 60})
            req.user = user;
        } else {
            const admin = await Admin.findOne({_id, token}).populate("client");
            if (!admin) {
                throw new NotFoundError("Cannot find admin!");
            }
            res.cookie("access_token", token, {httpOnly: true, maxAge: 1000 * 60 * 60});
            req.admin = admin;
            req.client = admin.client;
        }
        next();
    } catch (e) {
        console.log(e);
        res.redirect("/login")
    }
};

const userAuthMiddleware = (req, res, next) => {
    try {
        if (req.user)
            next();
        else
            throw new AuthenticationError("User not found");
    } catch (e) {
        res.redirect("/login")
    }
}

const adminAuthMiddleware = (req, res, next) => {
    try {
        if (req.admin)
            next();
        else
            throw new AuthenticationError("Admin not found");
    } catch (e) {
        res.redirect("/login")
    }
}

const mobileUserAuthMiddleware = async (req, res, next) => {
    try {
        console.log(req.method + "=>" + req.originalUrl)
        const token = req.header('Authorization').replace('Bearer ', '');
        const {_id} = jwt.verify(token, process.env.ACCESS_TOKEN);
        const user = await User.findOne({_id});
        if (!user)
            throw new AuthenticationError("User not found");
        req.user = user;
        next();
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

module.exports = {
    authMiddleware,
    userAuthMiddleware,
    adminAuthMiddleware,
    mobileUserAuthMiddleware
};
