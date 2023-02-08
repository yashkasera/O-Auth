const Client = require("../../model/client");
const {NotFoundError, AuthenticationError} = require("../../util/error");

const getClientSecretController = async (req, res) => {
    try {
        const client = await Client.findById(req.client._id);
        if (!client) throw new NotFoundError('Client not found');
        res.status(200).send({
            client_id: client.client_id,
            client_secret: client.client_secret
        });
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

module.exports = {
    getClientSecretController,
}