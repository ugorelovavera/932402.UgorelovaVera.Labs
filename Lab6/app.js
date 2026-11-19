const express = require("express");
const path = require("path");

const app = express();


app.use(function(request, response, next) {
    console.log(`${new Date().toISOString()} ${request.method} ${request.url}`);
    next();
});


app.use(express.static("public"));


app.get("/", function(request, response) {
    response.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/about", function(request, response) {
    response.sendFile(path.join(__dirname, "public", "about.html"));
});


app.get("/api/greet/:name", function(request, response) {
    const name = request.params.name;


    const namePattern = /^[A-Za-zА-Яа-яЁё]{1,50}$/;
    if (!namePattern.test(name)) {
        return response.status(400).json({ error: "Invalid name" });
    }

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
app.use(function(request, response) {
    response.status(404).json({ error: "Not found" });
});
app.listen(3000);