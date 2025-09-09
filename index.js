const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// --- CONFIGURACIÓN ---
// Tus credenciales seguras. ¡Recuerda usar las reales!
const USERNAME = "PAEJ1992";
const PASSWORD = "PANDA2022";

app.get('/canal', (req, res) => {
    // Ahora pedimos el ID del canal. Ej: ?id=741816
    const channelId = req.query.id;
    if (!channelId) {
        return res.status(400).json({ error: 'Debes especificar el ID del canal. Ej: ?id=741816' });
    }

    // Construimos la URL final del video directamente
    const finalUrl = `http://tutv.plus:8080/live/${USERNAME}/${PASSWORD}/${channelId}.m3u`;

    // Devolvemos la URL construida
    res.json({ success: true, url: finalUrl });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor de IDs de IPTV iniciado en http://localhost:${PORT}`);
});
