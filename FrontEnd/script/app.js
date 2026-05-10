const API = "http://localhost:8080";

const sections = [
    "./sections/home.html",
    "./sections/login.html",
    "./sections/cadastro.html",
    "./sections/perfil-drawer.html",
    "./sections/chat.html",
    "./sections/perfil-usuario.html",
    "./sections/footer.html",
];

const scripts = [
    "./script/auth.js",
    "./script/tecnicos.js",
    "./script/chat.js",
    "./script/avaliacoes.js",
];

async function loadSections() {
    const app = document.getElementById("app");
    const htmlSections = await Promise.all(
        sections.map(async (section) => {
            const response = await fetch(section);
            if (!response.ok) throw new Error(`Nao foi possivel carregar ${section}`);
            return response.text();
        })
    );
    app.innerHTML = htmlSections.join("\n");
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Nao foi possivel carregar ${src}`));
        document.body.appendChild(script);
    });
}

/* ---------- TELAS ---------- */
function showScreen(tela) {
    ["home", "login", "cadastro", "perfilUsuario"].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.classList.add("hidden"); el.classList.remove("flex"); }
    });

    const el = document.getElementById(tela);
    if (!el) return;
    el.classList.remove("hidden");
    if (tela === "login" || tela === "cadastro") el.classList.add("flex");
}

/* ---------- LOGIN USER ---------- */
function loginUser(user) {
    localStorage.setItem("logado", "true");

    const userEmail = document.getElementById("userEmail");
    if (userEmail) userEmail.innerText = user.nome || user.email || "";

    const avatarLetra = document.getElementById("userAvatar");
    const avatarImg = document.getElementById("userAvatarImg");

    if (user.foto && avatarImg) {
        avatarImg.src = user.foto;
        avatarImg.classList.remove("hidden");
        if (avatarLetra) avatarLetra.classList.add("hidden");
    } else {
        if (avatarLetra) avatarLetra.innerText = (user.nome || user.email || "U").charAt(0).toUpperCase();
        if (avatarImg) avatarImg.classList.add("hidden");
        if (avatarLetra) avatarLetra.classList.remove("hidden");
    }

    document.getElementById("navButtons")?.classList.add("hidden");
    document.getElementById("userArea")?.classList.remove("hidden");

    showScreen("home");
}

/* ---------- SESSÃO PERSISTENTE ---------- */
function iniciarSessaoPersistente() {
    const logado = localStorage.getItem("logado");
    const user = JSON.parse(localStorage.getItem("user"));
    if (logado && user) loginUser(user);
}

/* ---------- START ---------- */
async function startApp() {
    try {
        await loadSections();

        for (const script of scripts) {
            await loadScript(script);
        }

        if (typeof iniciarAuth === "function") iniciarAuth();
        if (typeof iniciarSessaoPersistente === "function") iniciarSessaoPersistente();
        if (typeof renderTecnicos === "function") renderTecnicos();
        if (typeof iniciarEventosChat === "function") iniciarEventosChat();
        if (typeof iniciarEventosTecnicos === "function") iniciarEventosTecnicos();
        if (typeof iniciarEventosAvaliacoes === "function") iniciarEventosAvaliacoes();

    } catch (error) {
        console.error(error);
        document.getElementById("app").innerHTML = `
            <section class="min-h-screen flex items-center justify-center p-6 text-center">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800 mb-3">Erro ao carregar a pagina</h1>
                    <p class="text-slate-500">Abra pelo Live Server para carregar as secoes.</p>
                </div>
            </section>
        `;
    }
}

startApp();