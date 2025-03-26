const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
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
    cards: [{
        front: {
            type: String,
            required: true
        },
        back: {
            type: String,
            required: true
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
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;