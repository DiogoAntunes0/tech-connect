window.abrirChat      = abrirChat;
window.fecharChat     = fecharChat;
window.enviarMensagem = enviarMensagem;

let chatAtual = null;

function abrirChat(tecnico) {
    if (!tecnico) return;
    chatAtual = tecnico;

    document.getElementById("chatNome").innerText  = tecnico.nome || "";
    document.getElementById("chatArea").innerText  = tecnico.area || "";

    const avatar = document.getElementById("chatAvatar");
    if (avatar) avatar.src = tecnico.foto || "https://i.pravatar.cc/150?img=1";

    const chat = document.getElementById("chatBox");
    chat.classList.remove("hidden");
    chat.offsetHeight;
    setTimeout(() => chat.classList.remove("translate-x-full"), 50);

    carregarMensagens();
}

function fecharChat() {
    const chat = document.getElementById("chatBox");
    chat.classList.add("translate-x-full");
    setTimeout(() => chat.classList.add("hidden"), 300);
}

/* ── GET /api/mensagens?usuarioId=&tecnicoId= ── */
async function carregarMensagens() {
    const container = document.getElementById("chatMensagens");
    if (!container || !chatAtual) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) {
        // Usuário não logado: exibe aviso
        container.innerHTML = `
            <div class="text-center text-slate-400 text-sm py-8">
                Faça login para conversar com o técnico.
            </div>`;
        return;
    }

    try {
        const res = await fetch(`${API}/api/mensagens?usuarioId=${user.id}&tecnicoId=${chatAtual.id}`);
        if (!res.ok) throw new Error("Erro ao carregar mensagens");
        const msgs = await res.json();

        container.innerHTML = "";
        msgs.forEach(m => appendMensagem(m, user));
        container.scrollTop = container.scrollHeight;
    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="text-center text-red-400 text-sm py-8">
                Não foi possível carregar o histórico.
            </div>`;
    }
}

function appendMensagem(m, user) {
    const container  = document.getElementById("chatMensagens");
    const euEnviei   = m.enviadoPeloUsuario === true;
    const hora       = m.enviadoEm
        ? new Date(m.enviadoEm).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        : "--:--";

    container.innerHTML += `
        <div class="flex ${euEnviei ? "justify-end" : "justify-start"} items-end gap-2">
            ${!euEnviei ? `<img src="${chatAtual.foto || "https://i.pravatar.cc/150?img=1"}" class="w-8 h-8 rounded-full object-cover">` : ""}
            <div class="${euEnviei ? "bg-indigo-600 text-white rounded-br-md" : "bg-white border rounded-bl-md"} max-w-[75%] px-4 py-3 rounded-2xl shadow-sm">
                <p class="text-sm">${m.texto}</p>
                <p class="text-[10px] mt-1 opacity-70">${hora}</p>
            </div>
            ${euEnviei && user?.foto ? `<img src="${user.foto}" class="w-8 h-8 rounded-full object-cover">` : ""}
        </div>`;
}

/* ── POST /api/mensagens ── */
async function enviarMensagem() {
    if (!chatAtual) return;
    const input  = document.getElementById("chatInput");
    const texto  = input.value.trim();
    if (!texto) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) { alert("Faça login para enviar mensagens."); return; }

    input.value = "";

    const payload = {
        usuarioId         : user.id,
        tecnicoId         : chatAtual.id,
        texto,
        enviadoPeloUsuario: true
    };

    try {
        const res = await fetch(`${API}/api/mensagens`, {
            method: "POST",
            headers: authHeader ? authHeader() : { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Erro ao enviar mensagem");

        const enviada = await res.json();
        const container = document.getElementById("chatMensagens");
        appendMensagem(enviada, user);
        container.scrollTop = container.scrollHeight;

        // Resposta automática simulada (remover quando o técnico responder de verdade)
        const digitando = document.getElementById("digitando");
        digitando.classList.remove("hidden");
        setTimeout(async () => {
            digitando.classList.add("hidden");
            const autoReply = {
                usuarioId         : user.id,
                tecnicoId         : chatAtual.id,
                texto             : "Olá! Recebi sua mensagem. Como posso ajudar?",
                enviadoPeloUsuario: false
            };
            try {
                const r2 = await fetch(`${API}/api/mensagens`, {
                    method: "POST",
                    headers: authHeader ? authHeader() : { "Content-Type": "application/json" },
                    body: JSON.stringify(autoReply)
                });
                if (r2.ok) {
                    const reply = await r2.json();
                    appendMensagem(reply, user);
                    container.scrollTop = container.scrollHeight;
                }
            } catch (e) { console.error(e); }
        }, 1500);

    } catch (err) {
        console.error(err);
        input.value = texto; // Devolve texto ao input se falhar
        alert("Erro ao enviar mensagem. Tente novamente.");
    }
}

function iniciarEventosChat() {
    const input = document.getElementById("chatInput");
    if (input) {
        input.addEventListener("keypress", e => {
            if (e.key === "Enter") { e.preventDefault(); enviarMensagem(); }
        });
    }

    // Botão de chat no perfil drawer
    const btnChatPerfil = document.getElementById("btnChatPerfil");
    if (btnChatPerfil) {
        btnChatPerfil.onclick = () => {
            if (window.tecnicoSelecionado) {
                fecharPerfil();
                setTimeout(() => abrirChat(window.tecnicoSelecionado), 450);
            }
        };
    }
}
