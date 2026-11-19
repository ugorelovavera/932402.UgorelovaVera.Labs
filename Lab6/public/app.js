const btn = document.getElementById("greetBtn");
const output = document.getElementById("output");

btn.addEventListener("click", async function () {
    const name = prompt("Ваше имя:", "Anna");
    if (!name) return;

    const lang = prompt("Язык (ru / en):", "ru") || "en";

    try {
        const res = await fetch(
            "/api/greet/" + encodeURIComponent(name) + "?lang=" + lang
        );
        const data = await res.json();

        if (!res.ok) {
            output.textContent = "Ошибка " + res.status + ": " + data.error;
            return;
        }
        output.textContent =
            data.message + " (" + data.lang + ", " + data.timestamp + ")";
    } catch (err) {
        output.textContent = "Сетевая ошибка — вы офлайн?";
    }
});