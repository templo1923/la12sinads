const express = require('express');
const cors = require('cors');
const app = express();

// Habilitamos CORS para que tu otro dominio (pruebala12) pueda hacerle peticiones
app.use(cors());

// --- CONFIGURACIÓN ---
// Tus credenciales reales y funcionales
const USERNAME = "PAEJ1992"; // Reemplaza con tu usuario real
const PASSWORD = "PANDA2022"; // Reemplaza con tu contraseña real

app.get('/canal', (req, res) => {
    const channelId = req.query.id;
    if (!channelId) {
        return res.status(400).json({ error: 'Debes especificar el ID del canal.' });
    }

    const finalUrl = `http://tutv.plus:8080/live/${USERNAME}/${PASSWORD}/${channelId}.m3u`;
    res.json({ success: true, url: finalUrl });
});

// Vercel maneja el servidor, no es necesario app.listen()
module.exports = app;
