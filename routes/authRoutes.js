
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { auth, JWT_SECRET } = require('../middleware/auth');

// Register route
router.post('/register', async (req, res) => {
try {
const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
        name,
        email,
        password
    });
    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
    res.status(201).json({ 
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        } 
    });
} catch (error) {
    res.status(400).json({ error: error.message });
}
});

// Login route
router.post('/login', async (req, res) => {
try {
const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET);
    
    res.json({ 
        token, 
        user: { 
            id: user._id, 
            name: user.name, 
            email: user.email 
        } 
    });
} catch (error) {
    res.status(400).json({ error: error.message });
}
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
try {
res.json({
user: {
id: req.user._id,
name: req.user.name,
email: req.user.email
}
});
} catch (error) {
res.status(400).json({ error: error.message });
}
});

module.exports = router;
