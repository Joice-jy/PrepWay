const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://wldbs1567:mongoDB-Joice@joanne93.5abw2tw.mongodb.net/prepway?retryWrites=true&w=majority&appName=Joanne93');
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB Atlas connection error:', error);
    }
};

module.exports = connectDB;

/*const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        // Create an in-memory MongoDB instance
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        // Connect to the in-memory database
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully (in-memory)');

        // Clean up the database when the app exits
        process.on('SIGTERM', async () => {
            await mongoose.connection.close();
            await mongod.stop();
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        // Don't exit in development, just log the error
        console.log('Continuing without database connection...');
    }
};

module.exports = connectDB;*/
