function iniciarAuth() {
    const fazerCadastro = document.getElementById("fazerCadastro");
    const cadUsuario = document.getElementById("cadUsuario");
    const cadEmail = document.getElementById("cadEmail");
    const cadSenha = document.getElementById("cadSenha");
    const cadSucesso = document.getElementById("cadSucesso");
    const fazerLogin = document.getElementById("fazerLogin");
    const loginEmail = document.getElementById("loginEmail");
    const loginSenha = document.getElementById("loginSenha");
    const loginErro = document.getElementById("loginErro");
    const btnLogout = document.getElementById("btnLogout");

    const btnLogin = document.getElementById("btnLogin");
    const btnCadastro = document.getElementById("btnCadastro");
    const voltarLogin = document.getElementById("voltarLogin");
    const voltarCadastro = document.getElementById("voltarCadastro");
    const voltarPerfilUsuario = document.getElementById("voltarPerfilUsuario");
    const btnMeuPerfil = document.getElementById("btnMeuPerfil");

    if (btnLogin) btnLogin.onclick = () => showScreen("login");
    if (btnCadastro) btnCadastro.onclick = () => showScreen("cadastro");
    if (voltarLogin) voltarLogin.onclick = () => showScreen("home");
    if (voltarCadastro) voltarCadastro.onclick = () => showScreen("home");
    if (voltarPerfilUsuario) voltarPerfilUsuario.onclick = () => showScreen("home");

    if (btnMeuPerfil) btnMeuPerfil.onclick = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        document.getElementById("perfilUserNome").innerText = user.nome || "";
        document.getElementById("perfilUserEmail").innerText = user.email || "";
        document.getElementById("editarNome").value = user.nome || "";
        document.getElementById("editarEmail").value = user.email || "";
        document.getElementById("editarBio").value = user.bio || "";
        document.getElementById("editarIdade").value = user.idade || "";
        document.getElementById("editarValorHora").value = user.valorHora || "";
        document.getElementById("editarEspecialidades").value = user.especialidades || "";
        document.getElementById("editarProjetos").value = user.projetos || "";

        showScreen("perfilUsuario");
    };

    if (fazerCadastro) {
        fazerCadastro.onclick = async () => {
            const nome = cadUsuario.value.trim();
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
            // Salva token e email para identificar o usuário
            const user = { token: data.token, email, nome: email.split("@")[0] };
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(user));

            loginErro.classList.add("hidden");
            loginUser(user);

            
        } catch (err) {
            console.error(err);
            loginErro.classList.remove("hidden");
        }
    };
}

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

 const salvarPerfilUsuario = document.getElementById("salvarPerfilUsuario");
if (salvarPerfilUsuario) {
    salvarPerfilUsuario.onclick = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const dadosAtualizados = {
            nome: document.getElementById("editarNome").value.trim(),
            email: document.getElementById("editarEmail").value.trim(),
            bio: document.getElementById("editarBio").value.trim(),
            idade: Number(document.getElementById("editarIdade").value) || null,
            valorHora: Number(document.getElementById("editarValorHora").value) || null,
            especialidades: document.getElementById("editarEspecialidades").value.trim(),
            projetos: document.getElementById("editarProjetos").value.trim(),
            foto: user.foto || null
        };

        try {
            const res = await fetch(`${API}/api/usuarios/${user.id}`, {
                method: "PUT",
                headers: authHeader(),
                body: JSON.stringify(dadosAtualizados)
            });

            if (!res.ok) throw new Error("Erro ao salvar");

            const atualizado = await res.json();

            // Atualiza localStorage com dados novos
            const userAtualizado = { ...user, ...atualizado };
            localStorage.setItem("user", JSON.stringify(userAtualizado));

            document.getElementById("userEmail").innerText = atualizado.nome;
            document.getElementById("perfilUserNome").innerText = atualizado.nome;
            document.getElementById("perfilUserEmail").innerText = atualizado.email;

            const perfilSalvo = document.getElementById("perfilSalvo");
            perfilSalvo.classList.remove("hidden");
            setTimeout(() => perfilSalvo.classList.add("hidden"), 2000);

        } catch (err) {
            console.error(err);
            alert("Erro ao salvar perfil. Tente novamente.");
        }
    };
}

}

function getToken() { return localStorage.getItem("token"); }
function authHeader() {
    return { "Authorization": `Bearer ${getToken()}`, "Content-Type": "application/json" };
}