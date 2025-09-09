const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/canal', async (req, res) => {
    const channelName = req.query.stream;
    if (!channelName) {
        return res.status(400).json({ error: 'Debes especificar un canal.' });
    }

    // ===== LA CLAVE DE LA SOLUCIÓN FINAL =====
    // Obtenemos la IP real del usuario que hace la petición a Vercel.
    // El header 'x-forwarded-for' es añadido por Vercel.
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const originalUrl = `https://la14hd.com/vivo/canales.php?stream=${channelName}`;

    try {
        // Creamos una cabecera personalizada para enviar la IP del usuario a La14HD
        const requestHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://la14hd.com/eventos/',
            // Le decimos a La14HD que la petición se origina desde la IP del usuario real
            'X-Forwarded-For': userIp
        };

        const response = await axios.get(originalUrl, { headers: requestHeaders });
        const html = response.data;
        const match = html.match(/var playbackURL = "(.*?)"/);

        if (match && match[1]) {
            const videoUrl = match[1];
            res.json({ success: true, url: videoUrl });
        } else {
            res.status(404).json({ success: false, error: 'No se pudo encontrar la URL del video.' });
        }

    } catch (error) {
        console.error("Error al obtener la URL:", error.message);
        res.status(500).json({ success: false, error: 'Hubo un error al procesar la solicitud.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor API iniciado en http://localhost:${PORT}`);
});
