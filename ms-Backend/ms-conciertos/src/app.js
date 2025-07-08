const express = require('express');
const app = express();
const conciertoRoutes = require('./routes/concierto.routes');

app.use(express.json());
app.use('/api/v1/conciertos', conciertoRoutes);

module.exports = app;
