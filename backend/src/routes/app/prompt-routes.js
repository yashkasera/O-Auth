const express = require('express');
const {mobileUserAuthMiddleware} = require("../../middleware/auth");
const Prompt = require("../../model/prompt");
const {NotFoundError} = require("../../util/error");
const router = express.Router();

router.use(mobileUserAuthMiddleware);

router.get('/approve', async (req, res) => {
    try {
        const prompt_id = req.query.id;
        console.log(prompt_id, req.user._id.toHexString());
        const prompt = await Prompt.findOne({_id: prompt_id, user: req.user._id.toHexString()});
        console.log(prompt)
        if(!prompt){
            throw new NotFoundError("Prompt not found!");
        }
        prompt.status = "success";
        await prompt.save();
        console.log(prompt)
        res.send(prompt);
    } catch (e) {
        console.error(e);
        res.status(e.statusCode || 400).send(e);
    }
})

router.get("/", async (req, res) => {
    try {
        let prompt = await Prompt.find({user: req.user._id, status: "active", expiry: {$gt: new Date()}})
        prompt = prompt.map((p) => {
            return {
                expiry: new Date(p.expiry).getTime(),
                prompt: p.prompt,
                _id: p._id,
                user: p.user,
                client: p.client,
                status: p.status,
                created_at: new Date(p.updatedAt).getTime(),
            }
        })
        console.log(prompt);
        res.send(prompt);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
console.log(new Date().getTime());
module.exports = router;