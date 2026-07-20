require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const topicRoutes = require('./src/routes/topicRoutes');
const roadmapRoutes = require('./src/routes/roadmapRoutes');
const progressRoutes = require('./src/routes/progressRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const attemptRoutes = require('./src/routes/attemptRoutes');
const notesRoutes = require('./src/routes/notesRoutes');

connectDB();

const app = express();

// Core middleware
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || '*' }));



app.use(express.json());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Health check - useful for confirming a Render deployment is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/notes', notesRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
