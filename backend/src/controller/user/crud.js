            const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const {OAUTH_CLIENT_ID} = require("../../util/Constants");

const createUserController = async (req, res) => {
    try {
        const {email, password, phone, name} = req.body;
        const user = new User({email, password, phone, name});
        let token = jwt.sign({_id: client._id.toString()}, process.env.ACCESS_TOKEN);
        user.tokens = user.tokens.concat({
            token: token,
            client: OAUTH_CLIENT_ID,
            expiry: Date.now() + 1000 * 60 * 60 * 24,
        });
        await user.save();
        res.status(201).send({user, token});
    } catch (e) {
        console.error(e);
        res.status(e.statusCode || 400).send(e);
    }
}

const getUserController = async (req, res) => {
    res.status(200).send(req.user);
}


const updateUserController = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'phone'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

const updateFCMTokenController = async (req, res) => {
    try {
        req.user.fcm_token = req.query.fcm_token;
        await req.user.save();
        res.status(200).send(req.user);
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

module.exports = {
    createUserController,
    getUserController,
    updateUserController,
    updateFCMTokenController
}