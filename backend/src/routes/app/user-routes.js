const express = require('express');
const router = express.Router();

const {
    loginUserController,
    signOutController,
} = require('../../controller/user/auth');

const {
    createUserController,
    getUserController,
    updateUserController,
    updateFCMTokenController
} = require("../../controller/user/crud");
const jwt = require("jsonwebtoken");
const {AuthenticationError} = require("../../util/error");
const User = require("../../model/user");
const {mobileUserAuthMiddleware} = require("../../middleware/auth");
const AccessToken = require("../../model/accesstoken");
const RefreshToken = require("../../model/refreshtoken");
const {revokeTokenController} = require("../../controller/token-controller");

router.post('/login', loginUserController)

router.use(mobileUserAuthMiddleware);

router
    .post('/logout', signOutController)
    .post('/new', createUserController);

router.get('/history', async (req, res) => {
    try {
        console.log(req.user);
        const tokens = await AccessToken.find({user: req.user._id})
            .populate("client", "name")
            .populate("user", "name")
        const data = tokens.map(token => {
            return {
                id: token._id,
                client: token.client.name,
                user: token.user.name,
                last_used: new Date(token.last_used).getTime()
            }
        });
        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/website", async (req, res) => {
    try {
        const tokens = await RefreshToken.find({user: req.user._id})
            .populate("client", "name")
            .populate("user", "name")
        console.log(tokens);
        const data = tokens.map(token => {
            return {
                id: token._id,
                client: token.client.name,
                user: token.user.name,
                status: token.status,
                updated_at: new Date(token.updatedAt).getTime(),
            }
        });
        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/token/revoke', revokeTokenController);

router.get('/', getUserController)
    .patch('/', updateUserController)
    .get('/fcm', updateFCMTokenController)


module.exports = router;