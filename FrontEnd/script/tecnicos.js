window.abrirPerfil  = abrirPerfil;
window.fecharPerfil = fecharPerfil;

/* ═══════════════════════════════════════════
   CARREGAR TÉCNICOS DA API
═══════════════════════════════════════════ */
async function carregarTecnicos(filtro = "") {
    const url = filtro
        ? `${API}/api/tecnicos/buscar?termo=${encodeURIComponent(filtro)}`
        : `${API}/api/tecnicos`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("API indisponível");
    const lista = await res.json();

    // Premium primeiro → depois por rating decrescente
    return lista.sort((a, b) => {
        if (b.premium !== a.premium) return (b.premium ? 1 : 0) - (a.premium ? 1 : 0);
        return (b.rating || 0) - (a.rating || 0);
    });
}

/* ═══════════════════════════════════════════
   RENDERIZAR LISTAGEM
═══════════════════════════════════════════ */
async function renderTecnicos(filtro = "") {
    const lista = document.getElementById("listaTecnicos");
    if (!lista) return;

    window._mostrarErroApi?.(false);

    // Skeleton
    lista.innerHTML = [1,2,3].map(() => `
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
            <div class="h-16 w-16 bg-slate-200 rounded-2xl mb-4"></div>
            <div class="h-5 bg-slate-200 rounded w-2/3 mb-3"></div>
            <div class="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div class="h-10 bg-slate-200 rounded-xl"></div>
        </div>`).join("");

    let tecnicos = [];
    try {
        tecnicos = await carregarTecnicos(filtro);
    } catch (err) {
        console.error("Erro ao carregar técnicos:", err);
        lista.innerHTML = "";
        window._mostrarErroApi?.(true);
        return;
    }

    // Atualiza hero e contador
    window._atualizarContador?.(tecnicos.length);
    if (!filtro) window._atualizarHeroDestaque?.(tecnicos);

    // Atualiza banners/botões premium conforme usuário
    window.atualizarUIUsuario?.();

    if (!tecnicos.length) {
        lista.innerHTML = `
            <div class="md:col-span-2 xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 text-center">
                <h3 class="text-xl font-bold text-slate-900 mb-2">Nenhum técnico encontrado</h3>
                <p class="text-slate-500">Tente buscar por suporte, redes, cloud ou infraestrutura.</p>
            </div>`;
        return;
    }

    const premiums = tecnicos.filter(t => t.premium);
    const normais  = tecnicos.filter(t => !t.premium);
    let html = "";

    if (premiums.length) {
        html += `
        <div class="md:col-span-2 xl:col-span-3 mb-2">
            <div class="flex items-center gap-3">
                <span class="text-amber-500 text-lg">★</span>
                <h3 class="font-bold text-slate-800">Técnicos em destaque</h3>
                <span class="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">Premium</span>
            </div>
        </div>`;
        html += premiums.map(t => cardTecnico(t)).join("");

        if (normais.length) {
            html += `
            <div class="md:col-span-2 xl:col-span-3 mt-4 mb-2 border-t border-slate-200 pt-6">
                <h3 class="font-bold text-slate-800">Outros técnicos</h3>
            </div>`;
            html += normais.map(t => cardTecnico(t)).join("");
        }
    } else {
        html = tecnicos.map(t => cardTecnico(t)).join("");
    }

    lista.innerHTML = html;
}

/* ═══════════════════════════════════════════
   CARD DO TÉCNICO
═══════════════════════════════════════════ */
function cardTecnico(t) {
    const premiumBadge = t.premium
        ? `<span class="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500
               text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
               ★ Premium
           </span>`
        : "";

    const borderClass = t.premium
        ? "border-amber-300 shadow-amber-100 shadow-lg ring-1 ring-amber-200"
        : "border-slate-100 hover:shadow-xl";

    const fotoClass = t.premium ? "ring-2 ring-amber-400" : "";

    const tJson = JSON.stringify(t).replace(/'/g, "&#39;");

    return `
    <article class="relative bg-white p-6 rounded-2xl shadow-sm border transition ${borderClass}">
        ${premiumBadge}
        <div class="flex items-start gap-4 mb-5">
            <img src="${t.foto || 'https://i.pravatar.cc/300?img=1'}"
                 alt="Foto de ${t.nome}"
                 class="w-16 h-16 rounded-2xl object-cover ${fotoClass}">
            <div class="flex-1 min-w-0">
                <button onclick='abrirPerfil(${tJson})'
                    class="block text-left font-bold text-lg text-slate-900 hover:text-indigo-600 transition truncate w-full">
                    ${t.nome}
                </button>
                <p class="text-indigo-600 text-sm font-semibold">${t.area || ""}</p>
                <p class="text-slate-500 text-sm">${t.cidade || ""}</p>
            </div>
        </div>

        <p class="text-slate-600 text-sm leading-relaxed line-clamp-3">${t.bio || ""}</p>

        <div class="flex flex-wrap gap-2 mt-4">
            ${(t.skills || []).slice(0, 3).map(s =>
                `<span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold">${s}</span>`
            ).join("")}
        </div>

        <div class="grid grid-cols-3 gap-3 my-5 text-center">
            <div class="bg-slate-50 rounded-xl p-3">
                <p class="font-bold text-slate-900">${t.rating   || "–"}</p>
                <p class="text-xs text-slate-500">Avaliação</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3">
                <p class="font-bold text-slate-900">${t.idade    || "–"}</p>
                <p class="text-xs text-slate-500">Idade</p>
            </div>
            <div class="bg-slate-50 rounded-xl p-3">
                <p class="font-bold text-slate-900">R$ ${t.valorHora || "–"}</p>
                <p class="text-xs text-slate-500">Hora</p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
            <button onclick='abrirPerfil(${tJson})'
                class="border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl text-sm font-semibold transition">
                Ver perfil
            </button>
            <button onclick='abrirChat(${tJson})'
                class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl text-sm font-semibold transition">
                Contatar
            </button>
        </div>
    </article>`;
}

/* ═══════════════════════════════════════════
   PERFIL DRAWER
═══════════════════════════════════════════ */
function abrirPerfil(tecnico) {
    if (!tecnico) return;
    window.tecnicoSelecionado = tecnico;

    document.getElementById("perfilNome").innerText          = tecnico.nome;
    document.getElementById("perfilArea").innerText          = tecnico.area         || "";
    document.getElementById("perfilCidade").innerText        = tecnico.cidade       || "";
    document.getElementById("perfilIdade").innerText         = tecnico.idade        || "";
    document.getElementById("perfilValor").innerText         = tecnico.valorHora    || "";
    document.getElementById("perfilRating").innerText        = tecnico.rating       || "";
    document.getElementById("perfilBio").innerText           = tecnico.bio          || "";
    document.getElementById("perfilFoto").src                = tecnico.foto         || "https://i.pravatar.cc/300?img=1";
    document.getElementById("perfilProjetosTotal").innerText = tecnico.projetos?.length || 0;
    document.getElementById("perfilSucesso").innerText       = tecnico.sucesso      || "96%";
    document.getElementById("perfilResposta").innerText      = tecnico.resposta     || "1h";
    document.getElementById("perfilAtendimentos").innerText  = tecnico.atendimentos || 0;

    // Badge premium no drawer
    const nomEl   = document.getElementById("perfilNome");
    const badgeEl = document.getElementById("perfilPremiumBadge");
    if (badgeEl) badgeEl.remove();
    if (tecnico.premium) {
        const badge = document.createElement("span");
        badge.id        = "perfilPremiumBadge";
        badge.className = "inline-flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full ml-3 align-middle";
        badge.innerHTML = "★ Premium";
        nomEl.after(badge);
    }

    // Botão premium no drawer — só para o próprio técnico sem premium
    const user = JSON.parse(localStorage.getItem("user"));
    const btnPremiumDrawer = document.getElementById("btnPremiumDrawer");
    if (btnPremiumDrawer) {
        if (user?.tecnicoId === tecnico.id && !tecnico.premium) {
            btnPremiumDrawer.classList.remove("hidden");
            btnPremiumDrawer.onclick = () => abrirModalPremium(tecnico);
        } else {
            btnPremiumDrawer.classList.add("hidden");
        }
    }

    // Skills
    document.getElementById("perfilSkills").innerHTML = (tecnico.skills || []).map(s =>
        `<span class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">${s}</span>`
    ).join("");

    // Projetos
    document.getElementById("perfilProjetos").innerHTML = (tecnico.projetos || []).map(p => `
        <article class="border border-slate-200 rounded-2xl overflow-hidden">
            <img src="${p.imagem || ''}" alt="${p.titulo || ''}" class="h-36 w-full object-cover">
            <div class="p-4">
                <h4 class="font-bold text-slate-900">${p.titulo || ""}</h4>
                <p class="text-sm text-slate-500 mt-2 leading-relaxed">${p.descricao || ""}</p>
            </div>
        </article>`).join("");

    const drawer = document.getElementById("perfilDrawer");
    const box    = document.getElementById("drawerBox");
    drawer.classList.remove("hidden");
    box.offsetHeight;
    setTimeout(() => box.classList.remove("translate-x-full"), 50);

    if (typeof carregarAvaliacoes === "function") carregarAvaliacoes();
}

window.fecharPerfil = function() {
    const box = document.getElementById("drawerBox");
    box.classList.add("translate-x-full");
    setTimeout(() => document.getElementById("perfilDrawer").classList.add("hidden"), 400);
};

/* ═══════════════════════════════════════════
   MODAL PREMIUM — funções globais
═══════════════════════════════════════════ */
window.abrirModalPremium = function(tecnico) {
    const modal = document.getElementById("modalPremium");
    if (!modal) return;
    window._tecnicoPremium = tecnico;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.getElementById("premiumStep1")?.classList.remove("hidden");
    document.getElementById("premiumStep2")?.classList.add("hidden");
    document.getElementById("premiumStep3")?.classList.add("hidden");
    const btn = document.getElementById("btnConfirmarPagamento");
    if (btn) { btn.disabled = false; btn.innerText = "Confirmar pagamento — R$ 49,00"; }
};

window.fecharModalPremium = function() {
    const modal = document.getElementById("modalPremium");
    modal.classList.add("hidden");
    modal.classList.remove("flex");
};

window.irParaPagamento = function() {
    document.getElementById("premiumStep1").classList.add("hidden");
    document.getElementById("premiumStep2").classList.remove("hidden");
};

window.simularPagamento = async function() {
    const btn = document.getElementById("btnConfirmarPagamento");
    if (btn) { btn.disabled = true; btn.innerText = "Processando..."; }

    await new Promise(r => setTimeout(r, 2000));

    const tecnico = window._tecnicoPremium;
    if (tecnico?.id) {
        try {
            const res = await fetch(`${API}/api/tecnicos/${tecnico.id}`, {
                method: "PUT",
                headers: typeof authHeader === "function" ? authHeader() : { "Content-Type": "application/json" },
                body: JSON.stringify({ ...tecnico, premium: true })
            });
            if (res.ok) {
                // Persiste premium no localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    user.premium = true;
                    localStorage.setItem("user", JSON.stringify(user));
                }
                window._tecnicoPremium.premium = true;
            }
        } catch (e) { console.error("Erro ao ativar premium:", e); }
    }

    document.getElementById("premiumStep2").classList.add("hidden");
    document.getElementById("premiumStep3").classList.remove("hidden");
};

window.fecharPremiumSucesso = function() {
    window.fecharModalPremium();
    window.atualizarUIUsuario?.();
    renderTecnicos();
};

/* ═══════════════════════════════════════════
   EVENTOS
═══════════════════════════════════════════ */
function iniciarEventosTecnicos() {
    const btnBuscar   = document.getElementById("btnBuscar");
    const searchInput = document.getElementById("searchInput");

    if (btnBuscar) {
        btnBuscar.onclick = () => {
            const valor = searchInput?.value.trim() || "";
            renderTecnicos(valor);
            document.getElementById("tecnicos").scrollIntoView({ behavior: "smooth" });
        };
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                renderTecnicos(searchInput.value.trim());
                document.getElementById("tecnicos").scrollIntoView({ behavior: "smooth" });
            }
        });
    }
}
