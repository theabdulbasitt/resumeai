const express = require('express'); // Force restart for model update
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then((conn) => console.log(`MongoDB Connected: ${conn.connection.host}`))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        // process.exit(1); // Optional: exit if DB fails
    });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
