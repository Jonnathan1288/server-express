const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.post('/api/test', (req, res) => {
    const body = req.body;

    const companyCode = req.headers["x-company-code"];
    const userCode = req.headers["x-user-code"];


    console.log({body: body});
    console.log({company: companyCode});
    console.log({user: userCode});
    return res.status(200).json({ data: 'OK' });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
