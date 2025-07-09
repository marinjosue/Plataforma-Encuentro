const express = require('express');
const app = express();
const conciertoRoutes = require('./routes/concierto.routes');
const zonasRoutes = require('./routes/zona.routes');

app.use(express.json());
app.use('/api/v1/conciertos', conciertoRoutes);
app.use('/api/v1/zonas', zonasRoutes);

module.exports = app;
