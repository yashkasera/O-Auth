const express = require('express');
const {NotFoundError} = require("../../util/error");
const router = express.Router();

router.use('/client', require('./client-routes'));
router.use('/admin', require('./admin-routes'));
router.use('/user', require('./user-routes'));
router.use('/prompt', require('./prompt-routes'));
router.use('/token', require('./token-routes'));

router.all('/*', (req, res, next) => {
    res.status(404).send(new NotFoundError());
});

module.exports = router;