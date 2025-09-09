const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

// --- CONFIGURACIÓN ---
// Aquí guardamos la URL de tu lista M3U de forma segura.
// ¡RECUERDA CAMBIAR LA CONTRASEÑA EN LA URL CUANDO TE LA DEN!
const M3U_URL = "http://tutv.plus:8080/get.php?username=PAEJ1992&password=NUEVA_CONTRASENA&type=m3u_plus";

app.get('/canal', async (req, res) => {
    // Ahora buscaremos por el nombre exacto del canal. Ej: ?nombre=Win Sports HD
    const channelName = req.query.nombre;
    if (!channelName) {
        return res.status(400).json({ error: 'Debes especificar el nombre del canal. Ej: ?nombre=Win Sports HD' });
    }

    try {
        // 1. Descargamos el contenido completo de tu lista M3U como texto
        const response = await axios.get(M3U_URL);
        const m3uText = response.data;

        // 2. Procesamos el texto para encontrar el canal
        const lines = m3uText.split('\n');
        let foundUrl = null;

        for (let i = 0; i < lines.length; i++) {
            // Buscamos la línea que contiene la información del canal
            // La coma al final es para buscar el nombre exacto: ",Win Sports HD"
            if (lines[i].startsWith('#EXTINF:') && lines[i].toLowerCase().includes(',' + channelName.toLowerCase())) {
                // El enlace del video es la línea siguiente
                foundUrl = lines[i + 1].trim();
                break;
            }
        }

        // 3. Devolvemos la URL encontrada o un error si no se encontró
        if (foundUrl) {
            res.json({ success: true, url: foundUrl });
        } else {
            res.status(404).json({ success: false, error: `El canal "${channelName}" no se encontró en la lista.` });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: 'No se pudo descargar o procesar la lista M3U.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor de Listas M3U iniciado en http://localhost:${PORT}`);
});
