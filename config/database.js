const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Connect to local MongoDB server
        await mongoose.connect('mongodb://localhost:27017/prepway', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to local MongoDB server');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDB;
