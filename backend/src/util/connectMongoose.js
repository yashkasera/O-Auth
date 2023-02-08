const mongoose = require('mongoose');

const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB is connected');
});

