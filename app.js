// app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const validateRequestBody = require('./middlewares/validateRequestBody');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config();
const app = express();

connectDB();

// Middleware to parse JSON and handle parsing errors
app.use((req, res, next) => {
    express.json()(req, res, (err) => {
        if (err) {
            console.error('JSON parsing error:', err.message);
            return res.status(400).json({ message: 'Invalid JSON format. Ensure your request body is well-formed.' });
        }
        next();
    });
});

// Middleware to validate request body after JSON parsing
app.use(validateRequestBody);

// Routes
const rulesRouter = require('./routes/rules');
const objectRoutes = require('./routes/objectRoutes');

app.use('/api/rules', rulesRouter);
app.use('/api/objects', objectRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Custom Rule Engine API');
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
