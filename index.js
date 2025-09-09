const express = require('express');
const axios = require('axios');
const app = express();

app.get('/canal', async (req, res) => {
    const channelName = req.query.stream;

    if (!channelName) {
        return res.status(400).send('Error: Debes especificar un canal usando el parámetro "stream".');
    }

    const originalUrl = `https://la14hd.com/vivo/canales.php?stream=${channelName}`;

    try {
        const response = await axios.get(originalUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://la14hd.com/eventos/'
            }
        });

        let htmlOriginal = response.data;

        const regexAclib = /<script id="aclib"[^>]*src="https:\/\/ads\.tiogol\.com\/aclib\.js"[^>]*><\/script>/gi;
        const regexRunPop = /<script type="text\/javascript">\s*aclib\.runPop\({[^}]*}\);\s*<\/script>/gi;
        const regexBlockJs = /<script src="https:\/\/ads\.tiogol\.com\/block\.js[^"]*"><\/script>/gi;

        let htmlLimpio = htmlOriginal
            .replace(regexAclib, '')
            .replace(regexRunPop, '')
            .replace(regexBlockJs, '');
        
        // ===== LÍNEA NUEVA Y CLAVE DE LA SOLUCIÓN =====
        // Añadimos la etiqueta <meta> para que el navegador no envíe el "Referer".
        const htmlFinal = htmlLimpio.replace('<head>', '<head><meta name="referrer" content="no-referrer">');

        res.send(htmlFinal); // Enviamos el HTML con la nueva etiqueta.

    } catch (error) {
        console.error("Error al obtener el canal:", error.message);
        res.status(500).send('Hubo un error al procesar la solicitud del canal.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor proxy iniciado y escuchando en http://localhost:${PORT}`);
});
