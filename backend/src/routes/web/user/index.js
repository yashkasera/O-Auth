const express = require('express');
const {authMiddleware, userAuthMiddleware} = require("../../../middleware/auth");
const AccessToken = require("../../../model/accesstoken");
const RefreshToken = require("../../../model/refreshtoken");
const router = express.Router();

router.use(authMiddleware);
router.use(userAuthMiddleware);

router.get('/history', async (req, res) => {
    const tokens =
        await AccessToken.find({user: req.user._id})
            .populate("client", "name")
            .populate("user", "name")
    console.log(tokens);
    const data = JSON.stringify(tokens.map(token => {
        return {
            id: token._id,
            client: token.client.name,
            user: token.user.name,
            last_used: token.last_used,
        }
    }));
    console.log(data)
    res.render('user_history', {message: null, user: req.user, data});
});

router.get('/account', async (req, res) => {
    res.render('user_edit', {message: null, user: req.user});
});

router.get('/', async (req, res) => {
    const tokens =
        await RefreshToken.find({user: req.user._id})
            .populate("client", "name")
            .populate("user", "name")
    console.log(tokens);
    const data = JSON.stringify(tokens.map(token => {
        return {
            id: token._id,
            client: token.client.name,
            user: token.user.name,
            status: token.status,
            updated_at: token.updatedAt,
        }
    }));
    console.log(data)
    res.render('user_dashboard', {message: null, user: req.user, data});
});


module.exports = router