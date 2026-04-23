// NAV
document.getElementById("btnLogin").onclick = () => showScreen("login");
document.getElementById("btnCadastro").onclick = () => showScreen("cadastro");
document.getElementById("voltarLogin").onclick = () => showScreen("home");
document.getElementById("voltarCadastro").onclick = () => showScreen("home");

// USER
function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function setLogged(email) {
    localStorage.setItem("logado", "true");
    localStorage.setItem("userEmail", email);
}

// CADASTRO
document.getElementById("fazerCadastro").onclick = () => {
    const email = document.getElementById("cadEmail").value.trim();
    const senha = document.getElementById("cadSenha").value.trim();

    if (!email || !senha) return alert("Preencha tudo");

    setUser({ email, senha });

    document.getElementById("cadSucesso").classList.remove("hidden");

    setTimeout(() => showScreen("login"), 1200);
};

// LOGIN
document.getElementById("fazerLogin").onclick = () => {
    const email = document.getElementById("loginEmail").value.trim();
    const senha = document.getElementById("loginSenha").value.trim();
    const user = getUser();

    if (user && user.email === email && user.senha === senha) {
        setLogged(email);
        location.reload();
    } else {
        document.getElementById("loginErro").classList.remove("hidden");
    }
};

// LOGADO
const navButtons = document.getElementById("navButtons");
const userArea = document.getElementById("userArea");

if (localStorage.getItem("logado") === "true") {
    navButtons.classList.add("hidden");
    userArea.classList.remove("hidden");
    document.getElementById("userEmail").innerText =
        localStorage.getItem("userEmail");
}

document.getElementById("btnLogout").onclick = () => {
    localStorage.clear();
    location.reload();
};