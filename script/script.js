// TELAS
const screens = {
  home: document.getElementById("home"),
  login: document.getElementById("login"),
  cadastro: document.getElementById("cadastro"),
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
    rating: 5,
  },
  {
    nome: "Mariana Costa",
    area: "Redes e Infraestrutura",
    cidade: "Osasco",
    rating: 4,
  },
  {
    nome: "Rafael Lima",
    area: "Desenvolvedor Web",
    cidade: "Barueri",
    rating: 5,
  },
  {
    nome: "Fernanda Rocha",
    area: "Segurança da Informação",
    cidade: "São Paulo",
    rating: 5,
  },
  {
    nome: "Carlos Mendes",
    area: "Cloud e DevOps",
    cidade: "Guarulhos",
    rating: 4,
  },
];

const lista = document.getElementById("listaTecnicos");

function renderTecnicos(filtro = "") {
  lista.innerHTML = "";

  tecnicos
    .filter((t) => t.area.toLowerCase().includes(filtro.toLowerCase()))
    .forEach((t) => {
      lista.innerHTML += `
        <div class="bg-white border p-4 rounded-xl shadow hover:shadow-lg transition">
          <h3 class="text-lg font-bold">${t.nome}</h3>
          <p class="text-green-600">${t.area}</p>
          <p class="text-gray-500">${t.cidade}</p>
          <p class="text-yellow-500">⭐ ${t.rating}</p>
          <button onclick="abrirModal(${JSON.stringify(t).replace(/"/g, '&quot;')})"
          class="mt-3 bg-green-600 text-white px-3 py-1 rounded w-full">
          Solicitar orçamento
          </button>
        </div>
      `;
    });
}

renderTecnicos();

// BUSCA
document.getElementById("btnBuscar").onclick = () => {
  const valor = document.getElementById("searchInput").value;
  renderTecnicos(valor);
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
