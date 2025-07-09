const express = require('express');
const app = express();

const reservaRoutes = require('./routes/reserva.routes');

app.use(express.json());
app.use('/api/v1/reservas', reservaRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'ms-reservas',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = app;
