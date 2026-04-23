// TELAS
const screens = {
    home: document.getElementById("home"),
    login: document.getElementById("login"),
    cadastro: document.getElementById("cadastro"),
    perfil: document.getElementById("perfil"),
};

function showScreen(screen) {
    Object.values(screens).forEach((s) => s.classList.add("hidden"));
    screens[screen].classList.remove("hidden");
}