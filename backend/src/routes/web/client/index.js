const express = require('express');
const {authMiddleware, adminAuthMiddleware} = require("../../../middleware/auth");
const router = express.Router();
const Client = require("../../../model/client");
const RefreshToken = require("../../../model/refreshtoken");

router.use(authMiddleware);
router.use(adminAuthMiddleware);

router.get('/credentials', async (req, res) => {
    const client = await Client.findById(req.client._id);
    const data = JSON.stringify({
        client_id: client._id,
        client_secret: client.client_secret
    })
    res.render('client_credentials', {message: null, admin: req.client, data});
});

router.get('/users', async (req, res) => {
    // console.log(req.client)
    const tokens = await RefreshToken.find({client: req.client._id})
        .populate("user", "name email");
    const users = tokens.map(token => {
        return {
            id: token._id,
            name: token.user.name,
            email: token.user.email,
            updated_at: token.updatedAt,
            status: token.status
        };
    });
    res.render('client_users', {message: null, admin: req.client, data: JSON.stringify(users)});
});


router.get('/account', async (req, res) => {
    // console.log(req.client)
    res.render('client_edit', {message: null, admin: req.admin, client1: req.client});
});

router.get('/', (req, res) => {
    const data = JSON.stringify(req.client)
    res.render('client_dashboard', {message: null, admin: data});
});

module.exports = router