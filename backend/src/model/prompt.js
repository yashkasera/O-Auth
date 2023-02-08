const mongoose = require('mongoose');
const User = require("./user");
const {sendPushNotification} = require("../util/firebase");

const prompt = new mongoose.Schema({
    prompt: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'success', "cancelled"],
        default: 'active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
        default: Date.now() + 1000 * 60 * 5
    },
}, {
    timestamps: true
});

prompt.pre('save', async function (next) {
    const prompt = this;
    const user = await User.findOne({_id: prompt.user});
    if (!user)
        throw new Error('Invalid User!');
    //send fcm notification to user
    /*const fcmToken = user.fcmToken;
    const payload = {
        notification: {
            title: 'New Prompt',
            body: prompt.prompt,
        },
        data: {
            prompt_id: prompt._id,
            client_id: prompt.client,
            user_id: prompt.user,
        },
    };
    const options = {
        priority: 'high',
        timeToLive: 60 * 5,
    };
    const response = await sendPushNotification(fcmToken, payload, options);
    console.log(response);*/
    next();
});

prompt.methods.toJSON = function () {
    const prompt = this;
    const promptObject = prompt.toObject();
    delete promptObject.__v;
    return promptObject;
}

const Prompt = mongoose.model('Prompt', prompt);
module.exports = Prompt;