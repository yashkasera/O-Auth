const AccessToken = require("../model/accesstoken");
const RefreshToken = require("../model/refreshtoken");
const mongoose = require("mongoose");

const revokeTokenController = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const refreshTokenId = req.query._id;
        const refreshToken = await RefreshToken.findOne({_id: refreshTokenId})
        console.log(refreshToken)
        const accessToken = await AccessToken.findOne({client: refreshToken.client, user: refreshToken.user})
        console.log(accessToken)
        refreshToken.token = null;
        refreshToken.status = "revoked";
        accessToken.token = null;
        await refreshToken.save({session});
        await accessToken.save({session});
        await session.commitTransaction();
        console.log("Token revoked");
        res.status(200).send({message: "Token revoked successfully!"});
    } catch (e) {
        await session.abortTransaction()
        res.status(400).send(e);
    }
    await session.endSession();
}

module.exports = {
    revokeTokenController
}