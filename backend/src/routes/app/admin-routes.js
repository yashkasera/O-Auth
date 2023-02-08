const express = require('express');
const router = express.Router();

const {
    loginAdminController,
    verifyAdminController,
    getAdminController,
    updateAdminController, createAdminController
} = require('../../controller/admin/auth');
const {getAllClients} = require("../../controller/admin/clients");

router
    .post('/new', createAdminController)
    .get('/login', loginAdminController);

router.use(verifyAdminController);

router.get('/', getAdminController)
    .patch('/', updateAdminController)

router.get('/clients', getAllClients);

module.exports = router;
