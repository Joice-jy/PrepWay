const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
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
    type: {
        type: String,
        required: true,
        enum: ['document', 'video', 'link', 'note']
    },
    content: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    collaborators: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        permissions: {
            type: String,
            enum: ['read', 'write'],
            default: 'read'
        }
    }],
    comments: [{
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
}, {
    timestamps: true
});

const StudyMaterial = mongoose.model('StudyMaterial', studyMaterialSchema);

module.exports = StudyMaterial;