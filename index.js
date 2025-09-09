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

    // --- SECCIÓN DE DEPURACIÓN ---
    // Intentamos obtener la IP del usuario desde diferentes cabeceras que usa Vercel
    const userIp = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket.remoteAddress;

    const originalUrl = `https://la14hd.com/vivo/canales.php?stream=${channelName}`;

    try {
        const requestHeaders = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Referer': 'https://la14hd.com/eventos/',
            'X-Forwarded-For': userIp
        };

        const response = await axios.get(originalUrl, { headers: requestHeaders });
        const html = response.data;
        const match = html.match(/var playbackURL = "(.*?)"/);

        if (match && match[1]) {
            const videoUrl = match[1];
            // Devolvemos la respuesta normal + la información de depuración
            res.json({
                success: true,
                url: videoUrl,
                debug_info: {
                    version: "v5_final_debug",
                    ip_detectada: userIp
                }
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'No se pudo encontrar la URL del video.',
                debug_info: {
                    version: "v5_final_debug",
                    ip_detectada: userIp
                }
            });
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Hubo un error al procesar la solicitud.',
            debug_info: {
                version: "v5_final_debug",
                ip_detectada: userIp
            }
        });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor API de depuración iniciado en http://localhost:${PORT}`);
});
