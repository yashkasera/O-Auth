const firebaseAdmin = require('firebase-admin');

const serviceAccount = require('../config/firebase.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

const sendPushNotification = async (token, payload, options) =>
    await firebaseAdmin.messaging().sendToDevice(token, payload, options);

module.exports = {
    firebaseAdmin,
    sendPushNotification
};