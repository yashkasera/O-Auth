const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String, required: true},
    message: {type: String, required: true},
    createdDate: {type: Date, default: Date.now}
});

const Contact = new mongoose.model('Contact', schema);

module.exports = Contact;