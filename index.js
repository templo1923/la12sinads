const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// Esta función extrae el arreglo Vw del texto HTML
function extractVwArray(html) {
    const match = html.match(/Vw\s*=\s*(\[\[.*?\]\]);/s);
    if (!match || !match[1]) {
        throw new Error("No se pudo encontrar el arreglo Vw.");
    }
    // Usamos una función para evaluar el texto del arreglo de forma segura
    return new Function(`return ${match[1]};`)();
}

// Esta función resuelve el rompecabezas
function decodePlaybackUrl(Vw) {
    let playbackURL = "";
    
    // El algoritmo de decodificación copiado del archivo original
    Vw.sort((a, b) => a[0] - b[0]);
    const k = 56941 + 545478; // La clave secreta (KXhtB + IlaOR)

    Vw.forEach(e => {
        let v = e[1];
        // atob está disponible globalmente en Node.js > v16
        let decodedValue = Buffer.from(v, 'base64').toString('utf8');
        let numericPart = parseInt(decodedValue.replace(/\D/g, ''));
        playbackURL += String.fromCharCode(numericPart - k);
    });

    return playbackURL;
}

app.get('/canal', async (req, res) => {
    const streamName = req.query.stream;
    if (!streamName) {
        return res.status(400).json({ error: 'Debes especificar un stream. Ej: ?stream=disney3' });
    }

    const targetUrl = `https://streamtp11.com/global1.php?stream=${streamName}`;

    try {
        // 1. Descargamos el HTML de la página
        const response = await axios.get(targetUrl);
        const html = response.data;

        // 2. Extraemos las piezas del rompecabezas (el arreglo Vw)
        const Vw = extractVwArray(html);

        // 3. Armamos la URL final
        const finalUrl = decodePlaybackUrl(Vw);

        // 4. Devolvemos la URL ya limpia
        res.json({ success: true, url: finalUrl });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'No se pudo obtener o decodificar la URL del video.', details: error.message });
    }
});

module.exports = app;
