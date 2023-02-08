const Admin = require("../../model/admin");
const {NotFoundError} = require("../../util/error");
const jwt = require("jsonwebtoken");

const verifyAdminController = async (req, res, next) => {
    try {
        const token = req.headers['authorization'].replace('Bearer ', '');
        if (!token) throw new NotFoundError('Admin not found');
        jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
            if (err) throw new NotFoundError('Admin not found');
            req.admin = await Admin.findOne({_id: decoded._id, 'tokens.token': token});
            next();
        });
    } catch (e) {
        console.error(e);
        res.status(e.statusCode || 400).send(e);
    }
}

const loginAdminController = async (req, res) => {
    const {email, password} = req.body;
    try {
        const admin = await Admin.findByCredentials(email, password);
        const token = await admin.generateAuthToken();
        res.status(200).send({admin, token});
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

const createAdminController = async (req, res) => {
    const {email, password, phone, name, role, client} = req.body;
    try {
        const admin = new Admin({email, password, phone, name, role, client});
        admin.isVerified = false;
        const token = await admin.generateAuthToken();
        await admin.save();
        res.status(201).send({admin, token});
    } catch (e) {
        console.error(e);
        res.status(e.statusCode || 400).send(e);
    }
}

const signOutController = async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.admin.save();
        res.status(200).send();
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

const signOutAllController = async (req, res) => {
    try {
        req.admin.tokens = [];
        await req.admin.save();
        res.status(200).send();
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

const getAdminController = async (req, res) => {
    res.status(200).send(req.admin);
}

const updateAdminController = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'phone'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try {
        updates.forEach((update) => req.admin[update] = req.body[update]);
        await req.admin.save();
        res.status(200).send(req.admin);
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

module.exports = {
    verifyAdminController,
    loginAdminController,
    createAdminController,
    signOutController,
    signOutAllController,
    getAdminController,
    updateAdminController,
}