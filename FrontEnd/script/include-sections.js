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
    "./script/app.js",
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

            if (!response.ok) {
                throw new Error(`Nao foi possivel carregar ${section}`);
            }

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

async function startApp() {
    try {
        await loadSections();

        for (const script of scripts) {
            await loadScript(script);
        }
    } catch (error) {
        console.error(error);
        document.getElementById("app").innerHTML = `
            <section class="min-h-screen flex items-center justify-center p-6 text-center">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800 mb-3">Erro ao carregar a pagina</h1>
                    <p class="text-slate-500">Abra pelo Live Server ou por um servidor local para carregar as secoes.</p>
                </div>
            </section>
        `;
    }
}

startApp();
