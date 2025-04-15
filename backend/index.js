const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

dotenv.config();
const app = express();

connectDB();

// Serve static files (CSS, JS, Images) from 'frontend' folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Serve login page (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'views', 'login.html'));
});


// Fallback route for unknown paths
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});


app.use(cors());
app.use(express.json());

// Routes for API
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
