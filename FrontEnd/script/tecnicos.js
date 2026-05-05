window.tecnicoSelecionado = null;

// Dados temporários para a vitrine. Substituir por resposta da API quando o backend disponibilizar estes campos.
const tecnicos = [
    {
        nome: "Lucas Andrade",
        area: "Suporte Técnico",
        cidade: "São Paulo",
        idade: 28,
        valor: 120,
        bio: "Especialista em suporte técnico para pequenas empresas, com experiência em manutenção preventiva, instalação de softwares, formatação, backup e atendimento remoto. Atua com comunicação clara para resolver chamados sem deixar dúvidas para o cliente.",
        foto: "https://i.pravatar.cc/300?img=67",
        rating: 4.8,
        sucesso: "97%",
        resposta: "45 min",
        atendimentos: 58,
        skills: ["Suporte", "Windows", "Backup", "Help desk", "Office 365"],
        projetos: [
            {
                titulo: "Padronização de estações",
                descricao: "Configuração de 18 computadores com backup, antivírus e políticas básicas de segurança.",
                imagem: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80"
            },
            {
                titulo: "Atendimento remoto recorrente",
                descricao: "Rotina de suporte para equipe administrativa com tempo médio de resposta inferior a 1 hora.",
                imagem: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80"
            }
        ],
        feedbacks: [
            { cliente: "Carlos Mendes", nota: 5, comentario: "Resolveu o problema de lentidão e explicou como evitar novas falhas." },
            { cliente: "Fernanda Lima", nota: 4, comentario: "Atendimento rápido e muito profissional." }
        ]
    },
    {
        nome: "Mariana Costa",
        area: "Redes e Infraestrutura",
        cidade: "Osasco",
        idade: 32,
        valor: 200,
        bio: "Atua com redes corporativas e servidores há mais de 10 anos. Planeja infraestrutura, organiza cabeamento, configura roteadores, VPNs e políticas de acesso para ambientes que precisam de estabilidade.",
        foto: "https://i.pravatar.cc/300?img=5",
        rating: 4.9,
        sucesso: "98%",
        resposta: "1h",
        atendimentos: 64,
        skills: ["Redes", "Servidores", "VPN", "Firewall", "Infraestrutura"],
        projetos: [
            {
                titulo: "Rede corporativa segmentada",
                descricao: "Projeto de VLANs, firewall e documentação de ativos para escritório com 40 usuários.",
                imagem: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80"
            },
            {
                titulo: "Migração de servidor local",
                descricao: "Reorganização de permissões, backup e monitoramento para reduzir indisponibilidade.",
                imagem: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80"
            }
        ],
        feedbacks: [
            { cliente: "Renato Alves", nota: 5, comentario: "Trouxe segurança para nossa rede e entregou tudo documentado." },
            { cliente: "Patrícia Gomes", nota: 5, comentario: "Excelente domínio técnico e comunicação objetiva." }
        ]
    },
    {
        nome: "Bruno Reis",
        area: "Desenvolvedor Full-Stack",
        cidade: "Paulista",
        idade: 48,
        valor: 500,
        bio: "Desenvolvedor full-stack com mais de 20 anos de experiência em sistemas web, integrações, automações e manutenção de aplicações críticas. Ajuda empresas a corrigirem falhas, evoluírem produtos e integrarem APIs.",
        foto: "https://i.pravatar.cc/300?img=18",
        rating: 5,
        sucesso: "99%",
        resposta: "2h",
        atendimentos: 83,
        skills: ["JavaScript", "APIs", "Banco de dados", "Spring Boot", "Front-end"],
        projetos: [
            {
                titulo: "Portal de atendimento",
                descricao: "Implementação de painel web responsivo com autenticação, relatórios e integrações.",
                imagem: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
            },
            {
                titulo: "Automação de processos",
                descricao: "Integração entre sistemas internos para reduzir retrabalho operacional.",
                imagem: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
            }
        ],
        feedbacks: [
            { cliente: "Juliana Rocha", nota: 5, comentario: "Entendeu a regra de negócio e entregou uma solução estável." },
            { cliente: "Márcio Souza", nota: 5, comentario: "Muito experiente, direto e cuidadoso nos testes." }
        ]
    }
];

function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos")) || [];
}

function toggleFavorito(nome) {
    let favs = getFavoritos();

    if (favs.includes(nome)) {
        favs = favs.filter(f => f !== nome);
    } else {
        favs.push(nome);
    }

    localStorage.setItem("favoritos", JSON.stringify(favs));
    renderTecnicos(document.getElementById("searchInput").value);
}

const lista = document.getElementById("listaTecnicos");

function renderTecnicos(filtro = "") {
    lista.innerHTML = `
${[1, 2, 3].map(() => `
<div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 animate-pulse">
  <div class="h-16 w-16 bg-slate-200 rounded-2xl mb-4"></div>
  <div class="h-5 bg-slate-200 rounded w-2/3 mb-3"></div>
  <div class="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
  <div class="h-4 bg-slate-200 rounded w-1/3 mb-5"></div>
  <div class="h-10 bg-slate-200 rounded-xl"></div>
</div>
`).join("")}
`;

    setTimeout(() => {
        const termo = filtro.toLowerCase();
        const resultado = tecnicos.filter(t => {
            const texto = `${t.nome} ${t.area} ${t.cidade} ${t.skills.join(" ")}`.toLowerCase();
            return texto.includes(termo);
        });

        if (!resultado.length) {
            lista.innerHTML = `
<div class="md:col-span-2 xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-8 text-center">
  <h3 class="text-xl font-bold text-slate-900 mb-2">Nenhum técnico encontrado</h3>
  <p class="text-slate-500">Tente buscar por suporte, redes, cloud, desenvolvimento ou infraestrutura.</p>
</div>
`;
            return;
        }

        lista.innerHTML = resultado.map(t => `
<article class="technician-card bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition">
  <div class="flex items-start gap-4 mb-5">
    <img src="${t.foto}" alt="Foto de ${t.nome}" class="w-16 h-16 rounded-2xl object-cover">
    <div class="flex-1 min-w-0">
      <button onclick='abrirPerfil(${JSON.stringify(t)})'
        class="block text-left font-bold text-lg text-slate-900 hover:text-indigo-600 transition">
        ${t.nome}
      </button>
      <p class="text-indigo-600 text-sm font-semibold">${t.area}</p>
      <p class="text-slate-500 text-sm">${t.cidade}</p>
    </div>
    <button onclick="toggleFavorito('${t.nome}')" aria-label="Favoritar ${t.nome}"
      class="favorite-button border border-slate-200 rounded-xl h-10 w-10 text-lg hover:bg-slate-50 transition">
      ${getFavoritos().includes(t.nome) ? "♥" : "♡"}
    </button>
  </div>

  <p class="text-slate-600 text-sm leading-relaxed line-clamp-3">${t.bio}</p>

  <div class="flex flex-wrap gap-2 mt-4">
    ${t.skills.slice(0, 3).map(skill => `<span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-xs font-semibold">${skill}</span>`).join("")}
  </div>

  <div class="grid grid-cols-3 gap-3 my-5 text-center">
    <div class="bg-slate-50 rounded-xl p-3">
      <p class="font-bold text-slate-900">${t.rating}</p>
      <p class="text-xs text-slate-500">Avaliação</p>
    </div>
    <div class="bg-slate-50 rounded-xl p-3">
      <p class="font-bold text-slate-900">${t.idade}</p>
      <p class="text-xs text-slate-500">Idade</p>
    </div>
    <div class="bg-slate-50 rounded-xl p-3">
      <p class="font-bold text-slate-900">R$ ${t.valor}</p>
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
</article>
`).join("");
    }, 400);
}

renderTecnicos();

function abrirPerfil(tecnico) {
    if (!tecnico) return;

    window.tecnicoSelecionado = tecnico;

    document.getElementById("perfilNome").innerText = tecnico.nome;
    document.getElementById("perfilArea").innerText = tecnico.area;
    document.getElementById("perfilCidade").innerText = tecnico.cidade;
    document.getElementById("perfilIdade").innerText = tecnico.idade;
    document.getElementById("perfilValor").innerText = tecnico.valor;
    document.getElementById("perfilRating").innerText = tecnico.rating;
    document.getElementById("perfilBio").innerText = tecnico.bio;
    document.getElementById("perfilFoto").src = tecnico.foto;
    document.getElementById("perfilProjetosTotal").innerText = tecnico.projetos?.length || 0;
    document.getElementById("perfilSucesso").innerText = tecnico.sucesso || "96%";
    document.getElementById("perfilResposta").innerText = tecnico.resposta || "1h";
    document.getElementById("perfilAtendimentos").innerText = tecnico.atendimentos || 0;

    const skills = document.getElementById("perfilSkills");
    skills.innerHTML = (tecnico.skills || []).map(skill => `
      <span class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">${skill}</span>
    `).join("");

    const projetos = document.getElementById("perfilProjetos");
    projetos.innerHTML = (tecnico.projetos || []).map(projeto => `
      <article class="border border-slate-200 rounded-2xl overflow-hidden">
        <img src="${projeto.imagem}" alt="Imagem do projeto ${projeto.titulo}" class="h-36 w-full object-cover">
        <div class="p-4">
          <h4 class="font-bold text-slate-900">${projeto.titulo}</h4>
          <p class="text-sm text-slate-500 mt-2 leading-relaxed">${projeto.descricao}</p>
        </div>
      </article>
    `).join("");

    const drawer = document.getElementById("perfilDrawer");
    const box = document.getElementById("drawerBox");

    drawer.classList.remove("hidden");
    box.offsetHeight;

    setTimeout(() => {
        box.classList.remove("translate-x-full");
    }, 50);

    if (typeof carregarAvaliacoes === "function") {
        carregarAvaliacoes();
    }
}

function fecharPerfil() {
    const box = document.getElementById("drawerBox");

    box.classList.add("translate-x-full");

    setTimeout(() => {
        document.getElementById("perfilDrawer").classList.add("hidden");
    }, 400);
}

document.getElementById("btnBuscar").onclick = () => {
    const valor = document.getElementById("searchInput").value;

    renderTecnicos(valor);

    document.getElementById("tecnicos").scrollIntoView({
        behavior: "smooth"
    });
};
