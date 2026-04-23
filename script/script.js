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

// TECNICOS (APENAS TI)
const tecnicos = [
  {
    nome: "Lucas Andrade",
    area: "Suporte Técnico",
    cidade: "São Paulo",
    idade: 28,
    valor: 120,
    bio: "Especialista em suporte técnico com foco em empresas.",
    foto: "https://i.pravatar.cc/150?img=1",
    rating: 4,
  },
  {
    nome: "Mariana Costa",
    area: "Redes e Infraestrutura",
    cidade: "Osasco",
    idade: 32,
    valor: 200,
    bio: "Atuo com redes corporativas e servidores há mais de 10 anos.",
    foto: "https://i.pravatar.cc/150?img=5",
    rating: 4.5,
  },
  {
    nome: "Bruno Reis",
    area: "Desenvolvedor Full-Stack",
    cidade: "Paulista",
    idade: 48,
    valor: 500,
    bio: "Atuo como desenvolvedor Full-Stack há mais de 20 anos.",
    foto: "https://i.pravatar.cc/150?img=18",
    rating: 5,
  }
];

// FAVORITOS
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

  // 🔹 Skeleton loading (antes de carregar)
  lista.innerHTML = `
    ${[1,2,3,4,5,6].map(() => `
      <div class="bg-white p-5 rounded-2xl shadow animate-pulse">
        <div class="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div class="h-8 bg-gray-200 rounded mt-4"></div>
      </div>
    `).join("")}
  `;

  // 🔹 Simula carregamento
  setTimeout(() => {

    lista.innerHTML = "";

    tecnicos
      .filter((t) => t.area.toLowerCase().includes(filtro.toLowerCase()))
      .forEach((t) => {

        lista.innerHTML += `
          <div class="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition fade-in group card-hover">

            <div class="flex items-center justify-between mb-3">

  <h3 
    onclick="abrirPerfil(${JSON.stringify(t).replace(/"/g, '&quot;')})"
    class="font-bold text-lg cursor-pointer group-hover:text-green-700 transition"
  >
    ${t.nome}
  </h3>

  <div class="flex items-center gap-2">

    <span class="text-yellow-500 text-sm">⭐ ${t.rating}</span>

    <button 
      onclick="toggleFavorito('${t.nome}')"
      class="text-lg"
    >
      ${getFavoritos().includes(t.nome) ? "❤️" : "🤍"}
    </button>

  </div>

</div>

            <p class="text-green-600 text-sm">${t.area}</p>
            <p class="text-gray-500 text-sm mb-3">${t.cidade}</p>

            <div class="flex justify-between items-center mt-4">

              <span class="text-sm text-gray-400">
                R$ ${t.valor || 100}/h
              </span>

              <button 
                onclick="abrirChat(${JSON.stringify(t).replace(/"/g, '&quot;')})"
                class="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm transition"
              >
                Contatar
              </button>

            </div>

          </div>
        `;
      });

  }, 600);
}
document.getElementById("voltarPerfil").onclick = () => {
  showScreen("home");
};

renderTecnicos();

let tecnicoSelecionado = null;

function abrirPerfil(tecnico) {
  tecnicoSelecionado = tecnico;

  document.getElementById("perfilNome").innerText = tecnico.nome;
  document.getElementById("perfilArea").innerText = tecnico.area;
  document.getElementById("perfilCidade").innerText = tecnico.cidade;
  document.getElementById("perfilIdade").innerText = tecnico.idade;
  document.getElementById("perfilValor").innerText = tecnico.valor;
  document.getElementById("perfilRating").innerText = tecnico.rating;
  document.getElementById("perfilBio").innerText = tecnico.bio;
  document.getElementById("perfilFoto").src = tecnico.foto;

  showScreen("perfil");

  carregarAvaliacoes();
}

// BUSCA
document.getElementById("btnBuscar").onclick = () => {
  const valor = document.getElementById("searchInput").value;

  renderTecnicos(valor);

  document.getElementById("listaTecnicos").scrollIntoView({
    behavior: "smooth"
  });
};

// ABRIR MODAL
function abrirModal(tecnico) {
  document.getElementById("modalTecnico").classList.remove("hidden");

  document.getElementById("modalNome").innerText = tecnico.nome;
  document.getElementById("modalArea").innerText = tecnico.area;
  document.getElementById("modalCidade").innerText = tecnico.cidade;
  document.getElementById("modalRating").innerText = "⭐ " + tecnico.rating;
}

// FECHAR MODAL
document.getElementById("fecharModal").onclick = () => {
  document.getElementById("modalTecnico").classList.add("hidden");
};

let chatAtual = null;

function abrirChat(tecnico) {
  chatAtual = tecnico;

  document.getElementById("chatNome").innerText = tecnico.nome;
  document.getElementById("chatArea").innerText = tecnico.area;

  const chat = document.getElementById("chatBox");

  chat.classList.remove("hidden");
  chat.classList.remove("translate-x-full"); // IMPORTANTE

  carregarMensagens();
}

function fecharChat() {
  const chat = document.getElementById("chatBox");

  chat.classList.add("translate-x-full");

  setTimeout(() => {
    chat.classList.add("hidden");
  }, 200);
}

// SALVAR / PEGAR MENSAGENS
function getMensagens() {
  return JSON.parse(localStorage.getItem("chat_" + chatAtual.nome)) || [];
}

function salvarMensagens(msgs) {
  localStorage.setItem("chat_" + chatAtual.nome, JSON.stringify(msgs));
}

// RENDER
function carregarMensagens() {
  const container = document.getElementById("chatMensagens");
  container.innerHTML = "";

  const msgs = getMensagens();

  msgs.forEach((m) => {
    container.innerHTML += `
  <div class="flex ${m.eu ? "justify-end" : "justify-start"}">
    <div class="${m.eu 
      ? "bg-green-600 text-white rounded-br-none" 
      : "bg-gray-200 rounded-bl-none"} 
      px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow">
      ${m.texto}
    </div>
  </div>
`;
  });

  container.scrollTop = container.scrollHeight;
}

// ENVIAR
function enviarMensagem() {
  const input = document.getElementById("chatInput");
  const texto = input.value.trim();

  if (!texto) return;

  const msgs = getMensagens();

  msgs.push({
    texto,
    eu: true
  });

  // resposta fake do técnico
  setTimeout(() => {
    msgs.push({
      texto: "Olá! Recebi sua mensagem 👍",
      eu: false
    });

    salvarMensagens(msgs);
    carregarMensagens();
  }, 800);

  salvarMensagens(msgs);
  input.value = "";
  carregarMensagens();
}

document.getElementById("btnChatPerfil").onclick = () => {
  abrirChat(tecnicoSelecionado);
};

// AVALIAÇÕES
function getAvaliacoes(nome) {
  return JSON.parse(localStorage.getItem("avaliacoes_" + nome)) || [];
}

function salvarAvaliacao(nome, nota, comentario) {
  const lista = getAvaliacoes(nome);

  lista.push({ nota, comentario });

  localStorage.setItem("avaliacoes_" + nome, JSON.stringify(lista));
}

function carregarAvaliacoes() {
  const container = document.getElementById("listaAvaliacoes");

  container.innerHTML = "";

  const avals = getAvaliacoes(tecnicoSelecionado.nome);

  avals.forEach(a => {
    container.innerHTML += `
      <div class="bg-gray-100 p-3 rounded-lg text-sm">
        <p class="text-yellow-500">⭐ ${a.nota}</p>
        <p class="text-gray-700">${a.comentario}</p>
      </div>
    `;
  });
}

document.getElementById("btnAvaliar").onclick = () => {
  const nota = document.getElementById("notaInput").value;
  const comentario = document.getElementById("comentarioInput").value;

  if (!comentario) return;

  salvarAvaliacao(tecnicoSelecionado.nome, nota, comentario);

  document.getElementById("comentarioInput").value = "";

  carregarAvaliacoes();
};
