const express = require('express');
const axios = require('axios');
const app = express();

// Creamos una ruta principal, por ejemplo /canal
app.get('/canal', async (req, res) => {
  // Obtenemos el nombre del canal desde la URL, ej: ?stream=winsportsplus
  const channelName = req.query.stream;

  // Si no nos dicen qué canal cargar, enviamos un error.
  if (!channelName) {
    return res.status(400).send('Error: Debes especificar un canal usando el parámetro "stream". Ejemplo: /canal?stream=winsportsplus');
  }

  // Construimos la URL original de La14HD dinámicamente
  const originalUrl = `https://la14hd.com/vivo/canales.php?stream=${channelName}`;

  try {
    // 1. Nuestro servidor pide el código HTML a La14HD
    const response = await axios.get(originalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://la14hd.com/eventos/' // Simulamos que venimos de la página de eventos
      }
    });

    let htmlOriginal = response.data;

    // 2. Usamos expresiones regulares para encontrar y eliminar los scripts de tiogol
    // Esto eliminará los 3 scripts que encontraste.
    const regexAclib = /<script id="aclib"[^>]*src="https:\/\/ads\.tiogol\.com\/aclib\.js"[^>]*><\/script>/gi;
    const regexRunPop = /<script type="text\/javascript">\s*aclib\.runPop\({[^}]*}\);\s*<\/script>/gi;
    const regexBlockJs = /<script src="https:\/\/ads\.tiogol\.com\/block\.js[^"]*"><\/script>/gi;

    let htmlLimpio = htmlOriginal
      .replace(regexAclib, '')
      .replace(regexRunPop, '')
      .replace(regexBlockJs, '');

    // 3. Enviamos el HTML ya limpio a tu página
    res.send(htmlLimpio);

  } catch (error) {
    console.error("Error al obtener el canal:", error.message);
    res.status(500).send('Hubo un error al procesar la solicitud del canal.');
  }
});

// El servidor se pone en marcha en un puerto
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor proxy iniciado y escuchando en http://localhost:${PORT}`);
});