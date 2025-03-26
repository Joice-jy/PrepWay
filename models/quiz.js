const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: Number,
            required: true
        },
        explanation: {
            type: String
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    attempts: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        score: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;