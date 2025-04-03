require('dotenv').config();

const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const studyRoutes = require('./routes/study');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));
app.use(limiter);

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads', 'materials');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/study', studyRoutes);

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

//////NEWWWW
app.post('/api/profile/update', (req, res) => {
    const { name, email } = req.body;
  
    // TODO: Replace this with actual user lookup (e.g., from session or JWT)
    const fakeUserId = '1234';
  
    // Save/update user in MongoDB
    User.findByIdAndUpdate(fakeUserId, { name, email }, { new: true, upsert: true })
      .then((updatedUser) => {
        res.json({ success: true, user: updatedUser });
      })
      .catch((err) => {
        console.error('DB error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
      });
  });

