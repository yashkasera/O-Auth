const Client = require("../../model/client");
const {nanoid} = require("nanoid");
const jwt = require("jsonwebtoken");
const {OAUTH_CLIENT_ID} = require("../../util/Constants");

const createClientController = async (req, res) => {
    const {name, callback_url_1, callback_url_2} = req.body;
    try {
        const client = new Client({name, callback_url_1, callback_url_2});
        client.client_secret = nanoid(24);
        await client.save();
        res.status(201).send(client);
    } catch (e) {
        console.error(e);
        res.status(e.statusCode || 400).send(e);
    }
}

const updateClientController = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','callback_url_1', 'callback_url_2'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try {
        updates.forEach((update) => req.client[update] = req.body[update]);
        await req.client.save();
        res.status(200).send(req.client);
    } catch (e) {
        res.status(e.statusCode || 400).send(e);
    }
}

const createNewClientCredentialsController = async (req, res) => {
    try {
        req.client.client_secret = nanoid(24);
        await req.client.save();
        const data = JSON.stringify({
            client_id: req.client._id,
            client_secret: req.client.client_secret
        })
        res.status(200).send(data);
    } catch (e) {
        console.error(e)
        res.status(e.statusCode || 400).send(e);
    }
}

module.exports = {
    createClientController,
    updateClientController,
    createNewClientCredentialsController
}