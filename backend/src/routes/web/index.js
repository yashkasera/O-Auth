const express = require('express');
const router = express.Router();
const clientRoutes = require('./client');
const userRoutes = require('./user');
const Contact = require("../../model/contact");
const {BadRequestError, NotFoundError} = require("../../util/error");
const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../../model/refreshtoken");
const {OAUTH_CLIENT_ID} = require("../../util/Constants");
const AccessToken = require("../../model/accesstoken");
const mongoose = require("mongoose");
const {authMiddleware} = require("../../middleware/auth");
const Admin = require("../../model/admin");
const Client = require("../../model/client");
const Prompt = require("../../model/prompt");

router.use('/client', clientRoutes);
router.use('/user', userRoutes);

router.get('/login/:client_id', async (req, res) => {
    try {
        const client_id = req.params.client_id;
        console.log(client_id);
        let client = await Client.findOne({_id: client_id});
        if (!client)
            throw new BadRequestError("Invalid client id");
        const client_data = {
            name: client.name,
            _id: client._id
        }
        res.render("login_middleware", {message: null, client_data});
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});

router.post("/login/:client_id", async (req, res) => {
    const client_id = req.params.client_id;
    let client = await Client.findOne({_id: client_id});
    const client_data = {
        name: client.name,
        _id: client._id
    }
    const session = await mongoose.startSession();
    try {
        await session.startTransaction();
        const {email, password} = req.body;
        const user = await User.findByCredentials(email, password);
        console.log(user._id.toHexString());
        let refresh_token = jwt.sign({
            _id: user._id.toString(),
        }, client.client_secret, {expiresIn: "1d"});
        let refreshToken = await RefreshToken.findOne({
            user: user._id,
            client: client._id
        }).session(session);
        if (refreshToken)
            refreshToken.token = refresh_token;
        else
            refreshToken = new RefreshToken({
                user: user._id,
                client: client._id,
                token: refresh_token
            });
        await refreshToken.save({session});
        await session.commitTransaction();
        res.cookie("refresh_token", refresh_token);
        res.redirect("/verify/" + client_id)
    } catch (e) {
        console.error(e);
        await session.abortTransaction();
        res.render("login_middleware", {message: e.message, client_data})
    }
    await session.endSession();
});

router.get("/verify/:client_id", async (req, res) => {
    const client_id = req.params.client_id;
    const refresh_token = req.cookies.refresh_token;
    let client = await Client.findOne({_id: client_id});
    const session = await mongoose.startSession();
    const client_data = {
        name: client.name,
        _id: client._id
    }
    try {
        await session.startTransaction();
        const refreshToken = await RefreshToken.findOne({token: refresh_token}).populate("user");
        if (!refreshToken)
            throw new BadRequestError("Invalid refresh token");
        if (refreshToken.status === "revoked")
            return res.status(401).send({
                statusCode: 401,
                name: "Authentication Error",
                message: "Refresh token revoked!"
            });
        const user = refreshToken.user;
        console.log(user, client);
        let prompt = await Prompt.findOne({
            user: user._id,
            client: client._id,
            expiry: {$gte: Date.now()}
        }).sort({_id: -1}).session(session);
        if (prompt) {
            if (prompt.status === "success") {
                console.log("success", prompt);
                let access_token = jwt.sign({
                    _id: user._id.toString(),
                }, client.client_secret);
                let accessToken = await AccessToken.findOne({
                    user: user._id,
                    client: client._id
                }).session(session);
                if (accessToken)
                    accessToken.token = access_token;
                else
                    accessToken = new AccessToken({
                        user: user._id,
                        client: client._id,
                        token: access_token,
                    })
                await accessToken.save({session});
                await session.commitTransaction();
                res.cookie("refresh_token", refresh_token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
                res.cookie("access_token", access_token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
                res.cookie("user", JSON.stringify({
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }), {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none"
                });
                return res.redirect(client.callback_url_1);
            } else if (prompt.status === "active") {
                console.log("active", prompt);
                prompt.expiry = Date.now() + 1000 * 60 * 5;
            } else {
                prompt = new Prompt({
                    user: user._id,
                    client: client._id,
                    prompt: "Login request from " + client.name,
                });
            }
        } else {
            prompt = new Prompt({
                user: user._id,
                client: client._id,
                prompt: "Login request from " + client.name,
            });
        }
        await prompt.save({session});
        await session.commitTransaction();
        res.render("verifyqr", {user: JSON.stringify(user), client_data, prompt_data: prompt});
    } catch (e) {
        console.error(e);
        await session.abortTransaction();
        res.status(400).send(e);
    }
})

router.get('/login', async (req, res) => {
    const token = req.cookies.access_token
    if (token) {
        console.log(token)
        return await authMiddleware(req, res, () => {
                if (req.user) {
                    return res.redirect("user")
                } else if (req.client)
                    return res.redirect("client");
            }
        )
    }
    res.render('login', {message: null, data: null});
})
    .post('/login', async (req, res) => {
        console.log(req.body);
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const {user_type, email, password} = req.body;
            if (!user_type || !email || !password) {
                throw new BadRequestError('Invalid Input!')
            }
            if (user_type === 'user') {
                const user = await User.findByCredentials(email, password);
                let token = jwt.sign({
                    _id: user._id.toString(),
                    user_type: 'user'
                }, process.env.REFRESH_TOKEN);
                let refresh_token = await RefreshToken.findOne({
                    user: user._id,
                    client: OAUTH_CLIENT_ID
                });
                if (refresh_token)
                    refresh_token.token = token;
                else
                    refresh_token = new RefreshToken({
                        user: user._id,
                        client: OAUTH_CLIENT_ID,
                        token
                    });
                await refresh_token.save({session});
                let accToken = jwt.sign({
                    _id: user._id.toString(),
                    user_type: 'user'
                }, process.env.ACCESS_TOKEN);
                let access_token = await AccessToken.findOne({
                    user: user._id,
                    client: OAUTH_CLIENT_ID
                });
                if (access_token)
                    access_token.token = accToken;
                else
                    access_token = new AccessToken({
                        user: user._id,
                        client: OAUTH_CLIENT_ID,
                        token: accToken,
                    })
                await access_token.save({session});
                await session.commitTransaction();
                const data = JSON.stringify({
                    user,
                    access_token: access_token.token,
                    refresh_token: refresh_token.token
                })
                res.cookie("access_token", access_token.token, {httpOnly: true, maxAge: 1000 * 60 * 60})
                res.cookie("refresh_token", refresh_token.token, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
                res.redirect('user');
            } else {
                const admin = await Admin.findByCredentials(email, password);
                let token = jwt.sign({
                    _id: admin._id.toString(),
                    user_type: 'admin'
                }, process.env.ACCESS_TOKEN);
                admin.token = token;
                await admin.save({session});
                await session.commitTransaction();
                const data = JSON.stringify(admin)
                res.cookie("access_token", admin.token, {httpOnly: true, maxAge: 1000 * 60 * 60})
                res.cookie("admin", data, {httpOnly: true, maxAge: 1000 * 60 * 60})
                res.redirect('client');
            }
        } catch (e) {
            await session.abortTransaction();
            console.log(e);
            res.render('login', {message: e.message});
        }
        session.endSession();
    })

router
    .get('/contact', (req, res) => {
        res.render('contact', {message: undefined});
    })
    .post('/contact', async (req, res) => {
        try {
            const {name, email, phone, message} = req.body;
            const contact = new Contact({name, email, phone, message});
            await contact.save()
            res.render('contact', {message: 'Message sent successfully'})
        } catch (e) {
            res.render('contact', {message: e.message})
        }
    })

router.get('/documentation', (req, res) => {
    res.render('documentation');
});

router.get('/', async (req, res) => {
    res.render('index')
})

router.get("*", (req, res) => {
    res.render("404");
});

module.exports = router