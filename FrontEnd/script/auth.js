function iniciarAuth() {
    const fazerCadastro   = document.getElementById("fazerCadastro");
    const cadUsuario      = document.getElementById("cadUsuario");
    const cadEmail        = document.getElementById("cadEmail");
    const cadSenha        = document.getElementById("cadSenha");
    const cadSucesso      = document.getElementById("cadSucesso");
    const fazerLogin      = document.getElementById("fazerLogin");
    const loginEmail      = document.getElementById("loginEmail");
    const loginSenha      = document.getElementById("loginSenha");
    const loginErro       = document.getElementById("loginErro");
    const btnLogout       = document.getElementById("btnLogout");
    const btnLogin        = document.getElementById("btnLogin");
    const btnCadastro     = document.getElementById("btnCadastro");
    const voltarLogin     = document.getElementById("voltarLogin");
    const voltarCadastro  = document.getElementById("voltarCadastro");
    const voltarPerfil    = document.getElementById("voltarPerfilUsuario");
    const btnMeuPerfil    = document.getElementById("btnMeuPerfil");

    if (btnLogin)       btnLogin.onclick       = () => showScreen("login");
    if (btnCadastro)    btnCadastro.onclick     = () => showScreen("cadastro");
    if (voltarLogin)    voltarLogin.onclick     = () => showScreen("home");
    if (voltarCadastro) voltarCadastro.onclick  = () => showScreen("home");
    if (voltarPerfil)   voltarPerfil.onclick    = () => showScreen("home");

    /* ── Abrir perfil do usuário ── */
    if (btnMeuPerfil) {
        btnMeuPerfil.onclick = () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return;

            document.getElementById("perfilUserNome").innerText  = user.nome  || "";
            document.getElementById("perfilUserEmail").innerText = user.email || "";
            document.getElementById("editarNome").value          = user.nome  || "";
            document.getElementById("editarEmail").value         = user.email || "";
            document.getElementById("editarBio").value           = user.bio   || "";
            document.getElementById("editarIdade").value         = user.idade || "";
            document.getElementById("editarValorHora").value     = user.valorHora || "";
            document.getElementById("editarEspecialidades").value = user.especialidades || "";
            document.getElementById("editarProjetos").value      = user.projetos || "";

            /* Foto de perfil salva */
            const preview = document.getElementById("previewFoto");
            const inicial = document.getElementById("perfilInicial");
            if (user.foto) {
                preview.src = user.foto;
                preview.classList.remove("hidden");
                if (inicial) inicial.classList.add("hidden");
            } else {
                if (inicial) {
                    inicial.innerText = (user.nome || user.email || "U").charAt(0).toUpperCase();
                    inicial.classList.remove("hidden");
                }
                preview.classList.add("hidden");
            }

            showScreen("perfilUsuario");
        };
    }

    /* ── Cadastro ── */
    if (fazerCadastro) {
        fazerCadastro.onclick = async () => {
            const nome  = cadUsuario.value.trim();
            const email = cadEmail.value.trim();
            const senha = cadSenha.value;
            if (!nome || !email || !senha) return;

            try {
                const res = await fetch(`${API}/api/auth/cadastrar`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome, email, senha })
                });
                if (!res.ok) throw new Error("Erro ao cadastrar");
                cadSucesso.classList.remove("hidden");
                setTimeout(() => showScreen("login"), 1200);
            } catch (err) {
                console.error(err);
                alert("Erro ao cadastrar. Tente novamente.");
            }
        };
    }

    /* ── Login — agora salva id, nome, foto vindos do back-end ── */
    if (fazerLogin) {
        fazerLogin.onclick = async () => {
            const email = loginEmail.value.trim();
            const senha = loginSenha.value;
            try {
                const res = await fetch(`${API}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, senha })
                });
                if (!res.ok) { loginErro.classList.remove("hidden"); return; }

                const data = await res.json();
                // AuthController retorna: { token, id, nome, email, foto }
                const user = {
                    token : data.token,
                    id    : data.id,
                    nome  : data.nome  || email.split("@")[0],
                    email : data.email || email,
                    foto  : data.foto  || null
                };
                localStorage.setItem("token", data.token);
                localStorage.setItem("user",  JSON.stringify(user));

                loginErro.classList.add("hidden");
                loginUser(user);
            } catch (err) {
                console.error(err);
                loginErro.classList.remove("hidden");
            }
        };
    }

    /* ── Logout ── */
    if (btnLogout) {
        btnLogout.onclick = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("logado");
            document.getElementById("userArea")?.classList.add("hidden");
            document.getElementById("navButtons")?.classList.remove("hidden");
            showScreen("home");
        };
    }

    /* ── Upload de foto (base64) → PATCH /api/usuarios/:id/foto ── */
    const inputFoto = document.getElementById("inputFoto");
    if (inputFoto) {
        inputFoto.onchange = async () => {
            const file = inputFoto.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = e.target.result;
                const user   = JSON.parse(localStorage.getItem("user"));
                if (!user?.id) return;

                try {
                    const res = await fetch(`${API}/api/usuarios/${user.id}/foto`, {
                        method: "PATCH",
                        headers: authHeader(),
                        body: JSON.stringify({ foto: base64 })
                    });
                    if (!res.ok) throw new Error("Erro ao enviar foto");

                    const data = await res.json();
                    user.foto = data.foto;
                    localStorage.setItem("user", JSON.stringify(user));

                    // Atualiza preview e avatar do nav
                    const preview = document.getElementById("previewFoto");
                    const inicial = document.getElementById("perfilInicial");
                    preview.src = data.foto;
                    preview.classList.remove("hidden");
                    if (inicial) inicial.classList.add("hidden");

                    const avatarImg   = document.getElementById("userAvatarImg");
                    const avatarLetra = document.getElementById("userAvatar");
                    if (avatarImg) { avatarImg.src = data.foto; avatarImg.classList.remove("hidden"); }
                    if (avatarLetra) avatarLetra.classList.add("hidden");
                } catch (err) {
                    console.error(err);
                    alert("Erro ao salvar foto. Tente novamente.");
                }
            };
            reader.readAsDataURL(file);
        };
    }

    /* ── Salvar perfil → PUT /api/usuarios/:id
         Se habilidades preenchidas → também cria/atualiza técnico via POST /api/tecnicos
    ── */
    const salvarPerfilUsuario = document.getElementById("salvarPerfilUsuario");
    if (salvarPerfilUsuario) {
        salvarPerfilUsuario.onclick = async () => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user?.id) return;

            const nome            = document.getElementById("editarNome").value.trim();
            const email           = document.getElementById("editarEmail").value.trim();
            const bio             = document.getElementById("editarBio").value.trim();
            const idade           = Number(document.getElementById("editarIdade").value) || null;
            const valorHora       = Number(document.getElementById("editarValorHora").value) || null;
            const especialidades  = document.getElementById("editarEspecialidades").value.trim();
            const projetos        = document.getElementById("editarProjetos").value.trim();

            const dadosUsuario = { nome, email, bio, idade, valorHora, especialidades, projetos, foto: user.foto || null };

            try {
                /* 1. Atualiza usuário */
                const resUser = await fetch(`${API}/api/usuarios/${user.id}`, {
                    method: "PUT",
                    headers: authHeader(),
                    body: JSON.stringify(dadosUsuario)
                });
                if (!resUser.ok) throw new Error("Erro ao salvar usuário");
                const atualizado = await resUser.json();

                const userAtualizado = { ...user, ...atualizado };
                localStorage.setItem("user", JSON.stringify(userAtualizado));

                document.getElementById("userEmail").innerText       = atualizado.nome;
                document.getElementById("perfilUserNome").innerText  = atualizado.nome;
                document.getElementById("perfilUserEmail").innerText = atualizado.email;

                /* 2. Se especialidades preenchidas → publica como técnico */
                if (especialidades) {
                    const skills = especialidades.split(",").map(s => s.trim()).filter(Boolean);

                    // Verifica se já é técnico (id salvo no localStorage)
                    const tecnicoId = user.tecnicoId || null;
                    const tecnicoPayload = {
                        nome,
                        area        : skills[0] || "",
                        cidade      : "",
                        idade,
                        valorHora,
                        bio,
                        foto        : user.foto || null,
                        skills,
                        sucesso     : "96%",
                        resposta    : "1h",
                        atendimentos: 0,
                        projetos    : []
                    };

                    let resTecnico;
                    if (tecnicoId) {
                        resTecnico = await fetch(`${API}/api/tecnicos/${tecnicoId}`, {
                            method: "PUT",
                            headers: authHeader(),
                            body: JSON.stringify(tecnicoPayload)
                        });
                    } else {
                        resTecnico = await fetch(`${API}/api/tecnicos`, {
                            method: "POST",
                            headers: authHeader(),
                            body: JSON.stringify(tecnicoPayload)
                        });
                    }

                    if (resTecnico.ok) {
                        const tecnico = await resTecnico.json();
                        userAtualizado.tecnicoId = tecnico.id;
                        localStorage.setItem("user", JSON.stringify(userAtualizado));

                        // Recarrega a listagem na home
                        if (typeof renderTecnicos === "function") renderTecnicos();
                    }
                }

                const perfilSalvo = document.getElementById("perfilSalvo");
                perfilSalvo.classList.remove("hidden");
                setTimeout(() => perfilSalvo.classList.add("hidden"), 2500);

            } catch (err) {
                console.error(err);
                alert("Erro ao salvar perfil. Tente novamente.");
            }
        };
    }
}

function getToken()    { return localStorage.getItem("token"); }
function authHeader()  { return { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" }; }
