// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = 3000;

// app.use(express.json());

// app.use(cors());

// app.post('/api/test', (req, res) => {
//     const body = req.body;

//     const companyCode = req.headers["x-company-code"];
//     const userCode = req.headers["x-user-code"];

//     console.log({body: body});
//     console.log({company: companyCode});
//     console.log({user: userCode});
//     return res.status(200).json({ data: 'OK' });
// });

// app.listen(port, () => {
//     console.log(`Servidor corriendo en http://localhost:${port}`);
// });

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
// require('dotenv').config();

const app = express();
const port = 3000;

const JWT_SECRET = "key-secure";

// Basic auth
const VALID_CREDENTIALS = {
    username: "user",
    password: "pass",
};

app.use(express.json());
app.use(cors());

app.post("/api/public", (req, res) => {
    const body = req.body;
    const companyCode = req.headers["x-company-code"];
    const userCode = req.headers["x-user-code"];

    console.log({ body: body });
    console.log({ company: companyCode });
    console.log({ user: userCode });

    return res
        .status(200)
        .json({ statusCode: 200, message: "Hook correctly received", data: body });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "user" && password === "pass") {
        const payload = {
            username: username,
            userId: 123,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.status(200).json({ statusCode: 200, message: "successful", token: token });
    } else {
        return res.status(401).json({ statusCode: 401, message: "Invalid credentials" });
    }
});

app.use("/api/hook/bearer", (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ statusCode: 401, message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ statusCode: 401, message: "Invalid or expired token" });
    }

    next();
});

app.post("/api/hook/bearer", (req, res) => {
    const body = req.body;

    const companyCode = req.headers["x-company-code"];
    const userCode = req.headers["x-user-code"];

    console.log({ body: body });
    console.log({ company: companyCode });
    console.log({ user: userCode });
    console.log({ userData: req.user });

    return res.status(200).json({ statusCode: 200, message: "Hook correctly received" });
});

app.post("/api/hook/basic", (req, res) => {
    const companyCode = req.headers["x-company-code"];
    const userCode = req.headers["x-user-code"];

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ statusCode: 401, message: "Missing Authorization header" });
    }

    if (!authHeader.startsWith("Basic ")) {
        return res.status(401).json({
            statusCode: 401,
            message: "Invalid Authorization header. Basic Auth required",
        });
    }

    let credentials;

    try {
        const base64Credentials = authHeader.split(" ")[1];
        credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    } catch (err) {
        return res
            .status(401)
            .json({ statusCode: 401, message: "Invalid Basic Auth credentials format" });
    }

    if (!credentials.includes(":")) {
        return res.status(401).json({
            statusCode: 401,
            message: "Invalid credentials format. Expected username:password",
        });
    }

    const [username, password] = credentials.split(":");

    if (!username || !password) {
        return res
            .status(401)
            .json({ statusCode: 401, message: "Username or password cannot be empty" });
    }

    if (username !== VALID_CREDENTIALS.username) {
        return res.status(401).json({ statusCode: 401, message: "Invalid username" });
    }

    if (password !== VALID_CREDENTIALS.password) {
        return res.status(401).json({ statusCode: 401, message: "Invalid password" });
    }

    const body = req.body;
    console.log({ body: body });
    console.log({ company: companyCode });
    console.log({ user: userCode });
    console.log({ username: username });

    return res.status(200).json({ statusCode: 200, message: "Hook correctly received" });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
