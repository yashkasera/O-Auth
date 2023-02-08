const express = require('express');
const router = express.Router();

const {getClientSecretController} = require('../../controller/client/auth');

const {
    createClientController,
    updateClientController,
    createNewClientCredentialsController
} = require("../../controller/client/crud");
const {authMiddleware, adminAuthMiddleware} = require("../../middleware/auth");

router.post('/new', createClientController)

router.use(authMiddleware)
    .use(adminAuthMiddleware)
    .patch('/', updateClientController)
    .get('/credentials', getClientSecretController)
    .get('/credentials/new', createNewClientCredentialsController)

module.exports = router;
