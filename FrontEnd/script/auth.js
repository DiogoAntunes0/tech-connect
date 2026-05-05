/* ----------- TELAS ----------- */

function showScreen(tela) {
    const telas = ["home", "login", "cadastro", "perfilUsuario"];

    telas.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.add("hidden");
            el.classList.remove("flex");
        }
    });

    if (tela === "home") {
        document.getElementById("home").classList.remove("hidden");
    }

    if (tela === "login") {
        const login = document.getElementById("login");
        login.classList.remove("hidden");
        login.classList.add("flex");
    }

    if (tela === "cadastro") {
        const cadastro = document.getElementById("cadastro");
        cadastro.classList.remove("hidden");
        cadastro.classList.add("flex");
    }

    if (tela === "perfilUsuario") {
        document.getElementById("perfilUsuario").classList.remove("hidden");
    }
}


/* ---------- STORAGE ---------- */

function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}


/* ---------- LOGIN ---------- */

function loginUser(user) {
    localStorage.setItem("logado", "true");

    document.getElementById("userEmail").innerText =
        user.usuario || user.nome || user.email;

    const avatarLetra = document.getElementById("userAvatar");
    const avatarImg = document.getElementById("userAvatarImg");

    if (user.foto) {
        avatarImg.src = user.foto;
        avatarImg.classList.remove("hidden");
        avatarLetra.classList.add("hidden");
    } else {
        avatarLetra.innerText =
            (user.usuario || user.email).charAt(0).toUpperCase();

        avatarImg.classList.add("hidden");
        avatarLetra.classList.remove("hidden");
    }

    document.getElementById("navButtons").classList.add("hidden");
    document.getElementById("userArea").classList.remove("hidden");

    showScreen("home");
}


/* ---------- NAVEGAÇÃO ---------- */

btnLogin.onclick = () => showScreen("login");
btnCadastro.onclick = () => showScreen("cadastro");
voltarLogin.onclick = () => showScreen("home");
voltarCadastro.onclick = () => showScreen("home");
voltarPerfilUsuario.onclick = () => showScreen("home");


/* ---------- CADASTRO ---------- */

fazerCadastro.onclick = () => {
    const usuario = cadUsuario.value.trim();
    const email = cadEmail.value.trim();
    const senha = cadSenha.value;

    if (!usuario || !email || !senha) return;

    setUser({
        usuario,
        email,
        senha,
        idade: "",
        valorHora: "",
        bio: "",
        especialidades: "",
        projetos: ""
    });

    cadSucesso.classList.remove("hidden");

    setTimeout(() => {
        showScreen("login");
    }, 1200);
};


/* ---------- LOGIN ---------- */

fazerLogin.onclick = () => {
    const email = loginEmail.value.trim();
    const senha = loginSenha.value;
    const user = getUser();

    if (user && user.email === email && user.senha === senha) {
        loginErro.classList.add("hidden");
        loginUser(user);
    } else {
        loginErro.classList.remove("hidden");
    }
};


/* ---------- LOGOUT ---------- */

btnLogout.onclick = () => {
    localStorage.removeItem("logado");

    document.getElementById("userArea").classList.add("hidden");
    document.getElementById("navButtons").classList.remove("hidden");

    showScreen("home");
};


/* -------- PERFIL DO USUÁRIO -------- */

btnMeuPerfil.onclick = () => {
    const user = getUser();
    if (!user) return;

    perfilUserNome.innerText = user.usuario;
    perfilUserEmail.innerText = user.email;

    editarNome.value = user.usuario || "";
    editarEmail.value = user.email || "";
    editarBio.value = user.bio || "";
    editarIdade.value = user.idade || "";
    editarValorHora.value = user.valorHora || "";
    editarEspecialidades.value = user.especialidades || "";
    editarProjetos.value = user.projetos || "";

    if (user.foto) {
        previewFoto.src = user.foto;
        previewFoto.classList.remove("hidden");
        perfilInicial.classList.add("hidden");
    } else {
        perfilInicial.innerText = (user.usuario || "U").charAt(0).toUpperCase();
        previewFoto.classList.add("hidden");
        perfilInicial.classList.remove("hidden");
    }

    showScreen("perfilUsuario");
};


/* -------- SALVAR PERFIL -------- */

salvarPerfilUsuario.onclick = () => {
    const user = getUser();
    if (!user) return;

    user.usuario = editarNome.value.trim();
    user.email = editarEmail.value.trim();
    user.bio = editarBio.value.trim();
    user.idade = editarIdade.value;
    user.valorHora = editarValorHora.value;
    user.especialidades = editarEspecialidades.value.trim();
    user.projetos = editarProjetos.value.trim();

    setUser(user);

    userEmail.innerText = user.usuario;
    perfilUserNome.innerText = user.usuario;
    perfilUserEmail.innerText = user.email;

    const avatarLetra = document.getElementById("userAvatar");
    const avatarImg = document.getElementById("userAvatarImg");

    if (user.foto) {
        avatarImg.src = user.foto;
        avatarImg.classList.remove("hidden");
        avatarLetra.classList.add("hidden");
    } else {
        avatarLetra.innerText = (user.usuario || "U").charAt(0).toUpperCase();
        avatarImg.classList.add("hidden");
        avatarLetra.classList.remove("hidden");
    }

    perfilSalvo.classList.remove("hidden");

    setTimeout(() => {
        perfilSalvo.classList.add("hidden");
    }, 2000);
};


/* -------- FOTO -------- */

inputFoto.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
        previewFoto.src = event.target.result;
        previewFoto.classList.remove("hidden");
        perfilInicial.classList.add("hidden");

        const user = getUser();
        if (!user) return;

        user.foto = event.target.result;
        setUser(user);
    };

    reader.readAsDataURL(file);
};


/* ------- LOGIN SOCIAL (DEMO) ------- */

googleLogin.onclick = () => {
    const user = {
        usuario: "Usuário Google",
        email: "google@usuario.com",
        idade: "",
        valorHora: "",
        bio: "",
        especialidades: "",
        projetos: ""
    };

    setUser(user);
    loginUser(user);
};

githubLogin.onclick = () => {
    const user = {
        usuario: "Usuário GitHub",
        email: "github@usuario.com",
        idade: "",
        valorHora: "",
        bio: "",
        especialidades: "",
        projetos: ""
    };

    setUser(user);
    loginUser(user);
};


/* ------- SESSÃO PERSISTENTE ------- */

function iniciarSessaoPersistente() {
    const logado = localStorage.getItem("logado");
    const user = getUser();

    if (logado && user) {
        loginUser(user);
    }
}

iniciarSessaoPersistente();
