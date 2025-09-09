const express = require('express');
const axios = require('axios');
const app = express();

// Habilitamos CORS para que tu web pueda hacerle peticiones
const cors = require('cors');
app.use(cors());

app.get('/canal', async (req, res) => {
    const channelName = req.query.stream;
    if (!channelName) {
        return res.status(400).json({ error: 'Debes especificar un canal usando el parámetro "stream".' });
    }

    const originalUrl = `https://la14hd.com/vivo/canales.php?stream=${channelName}`;

    try {
        const response = await axios.get(originalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://la14hd.com/eventos/'
            }
        });

        const html = response.data;

        // Usamos una expresión regular para encontrar y extraer la URL del video
        const match = html.match(/var playbackURL = "(.*?)"/);

        if (match && match[1]) {
            const videoUrl = match[1];
            // Devolvemos solo la URL en formato JSON
            res.json({ success: true, url: videoUrl });
        } else {
            res.status(404).json({ success: false, error: 'No se pudo encontrar la URL del video en la página.' });
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

// Importante: Necesitamos instalar la librería 'cors'
// En tu terminal, antes de subirlo, ejecuta: npm install cors