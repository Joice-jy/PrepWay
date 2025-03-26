const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'moderator', 'member'],
            default: 'member'
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudyMaterial'
    }],
    flashcards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flashcard'
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz'
    }],
    discussions: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        replies: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }]
    }],
    isPrivate: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

const StudyGroup = mongoose.model('StudyGroup', studyGroupSchema);

module.exports = StudyGroup;