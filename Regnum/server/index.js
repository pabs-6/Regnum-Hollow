const express = require('express');
const cors = require('cors');

require('dotenv').config({ path: './database.env' });

const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const statsRoutes = require('./routes/statsRoutes');
const cardsRoutes = require('./routes/cardsRoutes');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para asegurar la conexión de base de datos en entornos Serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Error en middleware DB:', error);
        res.status(500).json({ success: false, message: "Error al conectar con la base de datos" });
    }
});

// Rutas
app.use('/api', authRoutes);
app.use('/api', statsRoutes);
app.use('/api', cardsRoutes);

// Ruta test
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend funcionando'
    });
});

if (!process.env.VERCEL) {
    async function startServer() {
        try {
            await connectDB();
            app.listen(PORT, () => {
                console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error(error);
        }
    }
    startServer();
}

module.exports = app;