
window.abrirPerfil = abrirPerfil;

async function carregarTecnicos() {
    try {
        const res = await fetch(`${API}/api/tecnicos`);
        return await res.json();
    } catch (err) {
        console.error("Erro ao carregar técnicos:", err);
        return [];
    }
}

async function renderTecnicos(filtro = "") {
    const lista = document.getElementById("listaTecnicos");
    if (!lista) return;

    lista.innerHTML = `${[1,2,3].map(() => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
            <div class="h-16 w-16 bg-slate-200 rounded-2xl mb-4"></div>
            <div class="h-5 bg-slate-200 rounded w-2/3 mb-3"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
        </div>`).join("")}`;

    const tecnicos = await carregarTecnicos();
    const termo = filtro.toLowerCase();
    const resultado = tecnicos.filter(t => {
        const texto = `${t.nome} ${t.area} ${t.cidade} ${(t.skills || []).join(" ")}`.toLowerCase();
        return texto.includes(termo);
    });

    if (!resultado.length) {
        lista.innerHTML = `
            <div class="md:col-span-2 xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <h3 class="text-xl font-bold text-slate-900 mb-2">Nenhum técnico encontrado</h3>
                <p class="text-slate-500">Tente buscar por suporte, redes, cloud ou infraestrutura.</p>
            </div>`;
        return;
    }

    lista.innerHTML = resultado.map(t => `
        <article class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition">
            <div class="flex items-start gap-4 mb-5">
                <img src="${t.foto || 'https://i.pravatar.cc/300?img=1'}" alt="Foto de ${t.nome}" class="w-16 h-16 rounded-2xl object-cover">
                <div class="flex-1 min-w-0">
                    <button onclick='abrirPerfil(${JSON.stringify(t)})'
                        class="block text-left font-bold text-lg text-slate-900 hover:text-indigo-600 transition">
                        ${t.nome}
                    </button>
                    <p class="text-indigo-600 text-sm font-semibold">${t.area || ""}</p>
                    <p class="text-slate-500 text-sm">${t.cidade || ""}</p>
                </div>
            </div>
            <p class="text-slate-600 text-sm leading-relaxed line-clamp-3">${t.bio || ""}</p>
            <div class="flex flex-wrap gap-2 mt-4">
                ${(t.skills || []).slice(0,3).map(s =>
                    `<span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold">${s}</span>`
                ).join("")}
            </div>
            <div class="grid grid-cols-3 gap-3 my-5 text-center">
                <div class="bg-slate-50 rounded-xl p-3">
                    <p class="font-bold text-slate-900">${t.rating || "-"}</p>
                    <p class="text-xs text-slate-500">Avaliação</p>
                </div>
                <div class="bg-slate-50 rounded-xl p-3">
                    <p class="font-bold text-slate-900">${t.idade || "-"}</p>
                    <p class="text-xs text-slate-500">Idade</p>
                </div>
                <div class="bg-slate-50 rounded-xl p-3">
                    <p class="font-bold text-slate-900">R$ ${t.valorHora || "-"}</p>
                    <p class="text-xs text-slate-500">Hora</p>
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <button onclick='abrirPerfil(${JSON.stringify(t)})'
                    class="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl text-sm font-semibold transition">
                    Ver perfil
                </button>
                <button onclick='abrirChat(${JSON.stringify(t)})'
                    class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition">
                    Contatar
                </button>
            </div>
        </article>`).join("");
}

function abrirPerfil(tecnico) {
    if (!tecnico) return;
    window.tecnicoSelecionado = tecnico;

    document.getElementById("perfilNome").innerText = tecnico.nome;
    document.getElementById("perfilArea").innerText = tecnico.area || "";
    document.getElementById("perfilCidade").innerText = tecnico.cidade || "";
    document.getElementById("perfilIdade").innerText = tecnico.idade || "";
    document.getElementById("perfilValor").innerText = tecnico.valorHora || "";
    document.getElementById("perfilRating").innerText = tecnico.rating || "";
    document.getElementById("perfilBio").innerText = tecnico.bio || "";
    document.getElementById("perfilFoto").src = tecnico.foto || "https://i.pravatar.cc/300?img=1";
    document.getElementById("perfilProjetosTotal").innerText = tecnico.projetos?.length || 0;
    document.getElementById("perfilSucesso").innerText = tecnico.sucesso || "96%";
    document.getElementById("perfilResposta").innerText = tecnico.resposta || "1h";
    document.getElementById("perfilAtendimentos").innerText = tecnico.atendimentos || 0;

    const skills = document.getElementById("perfilSkills");
    skills.innerHTML = (tecnico.skills || []).map(s =>
        `<span class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">${s}</span>`
    ).join("");

    const projetos = document.getElementById("perfilProjetos");
    projetos.innerHTML = (tecnico.projetos || []).map(p => `
        <article class="border border-slate-200 rounded-2xl overflow-hidden">
            <img src="${p.imagem || ''}" alt="${p.titulo}" class="h-36 w-full object-cover">
            <div class="p-4">
                <h4 class="font-bold text-slate-900">${p.titulo}</h4>
                <p class="text-sm text-slate-500 mt-2 leading-relaxed">${p.descricao}</p>
            </div>
        </article>`).join("");

    const drawer = document.getElementById("perfilDrawer");
    const box = document.getElementById("drawerBox");
    drawer.classList.remove("hidden");
    box.offsetHeight;
    setTimeout(() => box.classList.remove("translate-x-full"), 50);

    if (typeof carregarAvaliacoes === "function") carregarAvaliacoes();
}

function iniciarEventosTecnicos() {
    const btnBuscar = document.getElementById("btnBuscar");
    if (btnBuscar) {
        btnBuscar.onclick = () => {
            const valor = document.getElementById("searchInput").value;
            renderTecnicos(valor);
            document.getElementById("tecnicos").scrollIntoView({ behavior: "smooth" });
        };
    }

    const btnFecharPerfil = document.getElementById("btnFecharPerfil");
    if (btnFecharPerfil) {
        btnFecharPerfil.onclick = () => {
            const box = document.getElementById("drawerBox");
            box.classList.add("translate-x-full");
            setTimeout(() => document.getElementById("perfilDrawer").classList.add("hidden"), 400);
        };
    }
}