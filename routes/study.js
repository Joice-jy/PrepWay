const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/auth');
const Flashcard = require('../models/flashcard');
const Quiz = require('../models/quiz');
const StudyMaterial = require('../models/studymaterial');
const StudyGroup = require('../models/StudyGroup');

// Configure multer for file uploads
const storage = multer.diskStorage({
destination: function(req, file, cb) {
cb(null, './uploads/materials');
},
filename: function(req, file, cb) {
cb(null, Date.now() + '-' + file.originalname);
}
});

const upload = multer({
storage: storage,
limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
fileFilter: function(req, file, cb) {
const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.jpg', '.png'];
const ext = path.extname(file.originalname).toLowerCase();
if (allowedTypes.includes(ext)) {
cb(null, true);
} else {
cb(new Error('Invalid file type'));
}
}
});

// Study material routes
router.post('/materials', auth, upload.single('file'), function(req, res) {
const fileUrl = req.file ? '/uploads/materials/' + req.file.filename : null;

const material = new StudyMaterial({
    owner: req.user._id,
    title: req.body.title,
    description: req.body.description,
    fileUrl: fileUrl,
    type: req.body.type
});

material.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Flashcard routes
router.post('/flashcards', auth, function(req, res) {
const flashcard = new Flashcard({
owner: req.user._id,
title: req.body.title,
front: req.body.front,
back: req.body.back
});

flashcard.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Quiz routes
router.post('/quizzes', auth, function(req, res) {
const quiz = new Quiz({
owner: req.user._id,
title: req.body.title,
questions: req.body.questions
});

quiz.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Study group routes
router.post('/groups', auth, function(req, res) {
const group = new StudyGroup({
name: req.body.name,
description: req.body.description,
owner: req.user._id,
members: [{ user: req.user._id, role: 'admin' }]
});

group.save()
    .then(saved => res.status(201).json(saved))
    .catch(err => res.status(400).json({ error: err.message }));
});

// GET routes
router.get('/materials', auth, function(req, res) {
StudyMaterial.find({ owner: req.user._id })
.then(materials => res.json(materials))
.catch(err => res.status(400).json({ error: err.message }));
});

router.get('/flashcards', auth, function(req, res) {
Flashcard.find({ owner: req.user._id })
.then(flashcards => res.json(flashcards))
.catch(err => res.status(400).json({ error: err.message }));
});

router.get('/quizzes', auth, function(req, res) {
Quiz.find({ owner: req.user._id })
.then(quizzes => res.json(quizzes))
.catch(err => res.status(400).json({ error: err.message }));
});

router.get('/groups', auth, function(req, res) {
StudyGroup.find({
$or: [
{ owner: req.user._id },
{ 'members.user': req.user._id }
]
})
.then(groups => res.json(groups))
.catch(err => res.status(400).json({ error: err.message }));
});

module.exports = router;
