const User = require('../../model/user');
const {NotFoundError, AuthenticationError} = require("../../util/error");
const jwt = require("jsonwebtoken");
const {OAUTH_CLIENT_ID} = require("../../util/Constants");

const loginUserController = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findByCredentials(email, password);
        let token = jwt.sign({_id: user._id.toString()}, process.env.ACCESS_TOKEN);
        user.phone_token = token;
        await user.save();
        res.status(200).send({user, token});
    } catch (e) {
        console.error(e);
        res.status(e.statusCode || 400).send(e);
    }
}

const signOutController = async (req, res) => {
    try {
        req.user.phone_token = null;
        await req.user.save();
        res.status(200).send({message:"Logged out successfully!"});
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}


module.exports = {
    loginUserController,
    signOutController,
}