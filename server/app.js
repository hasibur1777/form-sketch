const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const userRoutes = require('./routes/userRoutes');
const templateResponseRoutes = require('./routes/templateRoutes');
const userResponseRoutes = require('./routes/responseRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ROUTES
app.use('/', userRoutes);
app.use('/template', templateResponseRoutes);
app.use('/response', userResponseRoutes);

// HANDLE INVALID REQUESTS
app.get('/*', (req, res) => {
  res.status(400).json({ message: 'Invalid Request' });
});

module.exports = app;
