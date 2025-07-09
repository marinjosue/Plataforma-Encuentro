const express = require('express');
const app = express();
const entradaRoutes = require('./routes/entrada.routes');

app.use(express.json());
app.use('/api/v1/entradas', entradaRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'ms-entradas',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

module.exports = app;
