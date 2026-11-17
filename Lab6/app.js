const express = require("express");
const path = require("path");

const app = express();

// Логирование
app.use(function(request, response, next) {
    console.log(`${new Date().toISOString()} ${request.method} ${request.url}`);
    next();
});

// Статика
app.use(express.static("public"));

// Главная
app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname, "public", "index.html"));
});

// О сайте
app.get("/about", function(request, response) {
    response.sendFile(path.join(__dirname, "public", "about.html"));
});

// API
app.get("/api/greet/:name", function(request, response) {
    const name = request.params.name;
    const lang = (request.query.lang || "en").toLowerCase();

    const messages = {
        en: `Hello, ${name}!`,
        ru: `Привет, ${name}!`
    };

    response.json({
        message: messages[lang] || messages.en,
        timestamp: new Date().toISOString(),
        lang: lang === "ru" ? "ru" : "en"
    });
});

app.listen(3000);