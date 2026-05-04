/* ----------- TELAS ----------- */

function showScreen(tela) {

    const telas = ["home", "login", "cadastro", "perfilUsuario"];

    telas.forEach(id => {
        let el = document.getElementById(id);
        if (el) {
            el.classList.add("hidden");
            el.classList.remove("flex");
        }
    });

    if (tela === "home") {
        document.getElementById("home").classList.remove("hidden");
    }

    if (tela === "login") {
        let login = document.getElementById("login");
        login.classList.remove("hidden");
        login.classList.add("flex");
    }

    if (tela === "cadastro") {
        let cadastro = document.getElementById("cadastro");
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

    /* Nome no topo */
    document.getElementById("userEmail").innerText =
        user.usuario || user.nome || user.email;

    /* Avatar */
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

    const usuario = cadUsuario.value;
    const email = cadEmail.value;
    const senha = cadSenha.value;

    if (!usuario || !email || !senha) return;

    setUser({ usuario, email, senha });

    cadSucesso.classList.remove("hidden");

    setTimeout(() => {
        showScreen("login");
    }, 1200);
};


/* ---------- LOGIN ---------- */

fazerLogin.onclick = () => {

    const email = loginEmail.value;
    const senha = loginSenha.value;
    const user = getUser();

    if (user && user.email === email && user.senha === senha) {
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

    editarNome.value = user.usuario;
    editarEmail.value = user.email;
    editarBio.value = user.bio || "";

    if (user.foto) {
        previewFoto.src = user.foto;
        previewFoto.classList.remove("hidden");
        perfilInicial.classList.add("hidden");
    } else {
        perfilInicial.innerText = user.usuario.charAt(0).toUpperCase();
        previewFoto.classList.add("hidden");
        perfilInicial.classList.remove("hidden");
    }

    showScreen("perfilUsuario");
};


/* -------- SALVAR PERFIL -------- */

salvarPerfilUsuario.onclick = () => {

    let user = getUser();

    user.usuario = editarNome.value;
    user.email = editarEmail.value;
    user.bio = editarBio.value;

    setUser(user);

    /* Atualiza topo */
    userEmail.innerText = user.usuario;

    const avatarLetra = document.getElementById("userAvatar");
    const avatarImg = document.getElementById("userAvatarImg");

    if (user.foto) {
        avatarImg.src = user.foto;
        avatarImg.classList.remove("hidden");
        avatarLetra.classList.add("hidden");
    } else {
        avatarLetra.innerText = user.usuario.charAt(0).toUpperCase();
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

        let user = getUser();
        user.foto = event.target.result;

        setUser(user);
    };

    reader.readAsDataURL(file);
};


/* ------- LOGIN SOCIAL (DEMO) ------- */

googleLogin.onclick = () => {

    let user = {
        usuario: "Usuário Google",
        email: "google@usuario.com"
    };

    setUser(user);
    loginUser(user);
};

githubLogin.onclick = () => {

    let user = {
        usuario: "Usuário GitHub",
        email: "github@usuario.com"
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
