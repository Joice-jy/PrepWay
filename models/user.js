const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
name: {
type: String,
required: true,
trim: true
},
email: {
type: String,
required: true,
unique: true,
trim: true,
lowercase: true
},
password: {
type: String,
required: true
},
profilePicture: {
type: String,
default: ''
},
role: {
type: String,
enum: ['student', 'teacher'],
default: 'student'
},
enrolledCourses: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'Course'
}],
createdFlashcards: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'Flashcard'
}],
quizAttempts: [{
quiz: {
type: mongoose.Schema.Types.ObjectId,
ref: 'Quiz'
},
score: Number,
completedAt: Date
}],
studyGroups: [{
type: mongoose.Schema.Types.ObjectId,
ref: 'StudyGroup'
}],
lastActive: {
type: Date,
default: Date.now
}
}, {
timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
if (this.isModified('password')) {
this.password = await bcrypt.hash(this.password, 10);
}
next();
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;