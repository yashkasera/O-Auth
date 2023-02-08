const express = require('express');
const {authMiddleware} = require("../../middleware/auth");
const {revokeTokenController} = require("../../controller/token-controller");
const AccessToken = require("../../model/accesstoken");
const router = express.Router();

router.get("/revoke", authMiddleware, revokeTokenController);

router.post("/verify", async (req, res) => {
    console.log(req.body);
    try {
        const {client_id, access_token} = req.body;
        const accessToken = await AccessToken.findOne({client: client_id, token: access_token})
        if (!accessToken) {
            throw new Error("Invalid access token!");
        }
        if (new Date(accessToken.last_used).getTime() < (Date.now() - 1000 * 60 * 60)) {
            accessToken.last_used = Date.now();
            await accessToken.save();
            return res.send({message: "SUCCESS"});
        }
        else
            return res.status(218).send({message: "Access token expired!"});
    } catch (e) {
        console.error(e);
        return res.status(401).send(e);
    }
})

module.exports = router;