const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.post('/api/test', (req, res) => {
    const body = req.body;
    console.log({body: body});
    return res.status(200).json({ data: 'OK' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
