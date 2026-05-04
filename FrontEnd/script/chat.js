window.abrirChat = abrirChat;
window.fecharChat = fecharChat;
window.enviarMensagem = enviarMensagem;

let chatAtual = null;


/* ========= ABRIR CHAT ========= */
function abrirChat(tecnico) {

    if (!tecnico) {
        console.error("Nenhum técnico recebido no abrirChat()");
        return;
    }

    chatAtual = tecnico;

    document.getElementById("chatNome").innerText = tecnico.nome || "";
    document.getElementById("chatArea").innerText = tecnico.area || "";

    const avatar = document.getElementById("chatAvatar");

    if (avatar) {
        avatar.src = tecnico.foto || "https://i.pravatar.cc/150?img=1";
    }

    const chat = document.getElementById("chatBox");

    chat.classList.remove("hidden");

    /* força reflow para animação funcionar */
    chat.offsetHeight;

    setTimeout(() => {
        chat.classList.remove("translate-x-full");
    }, 50);

    carregarMensagens();

}



/* ========= FECHAR ========= */
function fecharChat() {

    const chat = document.getElementById("chatBox");

    chat.classList.add("translate-x-full");

    setTimeout(() => {
        chat.classList.add("hidden");
    }, 300);

}



/* ========= STORAGE ========= */
function getMensagens() {

    if (!chatAtual) return [];

    return JSON.parse(
        localStorage.getItem(
            "chat_" + chatAtual.nome
        )
    ) || [];

}


function salvarMensagens(msgs) {

    if (!chatAtual) return;

    localStorage.setItem(
        "chat_" + chatAtual.nome,
        JSON.stringify(msgs)
    );

}



/* ========= RENDER ========= */
function carregarMensagens() {

    const container =
        document.getElementById("chatMensagens");

    if (!container) return;

    container.innerHTML = "";

    const msgs = getMensagens();

    msgs.forEach(m => {

        const user = JSON.parse(localStorage.getItem("user"));

        container.innerHTML += `
<div class="flex ${m.eu ? 'justify-end' : 'justify-start'} items-end gap-2">

  ${!m.eu ? `
      <img src="${chatAtual.foto || 'https://i.pravatar.cc/150?img=1'}"
      class="w-8 h-8 rounded-full object-cover">
    ` : ''
            }

  <div class="
  ${m.eu
                ? 'bg-indigo-600 text-white rounded-br-md'
                : 'bg-white border rounded-bl-md'}
  max-w-[75%]
  px-4 py-3
  rounded-2xl
  shadow-sm">

    <p class="text-sm">${m.texto}</p>

    <p class="text-[10px] mt-1 opacity-70">
    ${m.hora}
    </p>

</div>

${m.eu ? `
    <img src="${user?.foto || ''}"
    class="w-8 h-8 rounded-full object-cover ${user?.foto ? '' : 'hidden'}">
    ` : ''
            }

</div>
`;

    });

    container.scrollTop =
        container.scrollHeight;

}



/* ========= ENVIAR ========= */
function enviarMensagem() {

    if (!chatAtual) return;

    const input =
        document.getElementById("chatInput");

    const texto =
        input.value.trim();

    if (!texto) return;

    const msgs = getMensagens();

    msgs.push({
        texto,
        eu: true,
        hora: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
    });

    salvarMensagens(msgs);

    input.value = "";

    carregarMensagens();


    /* digitando fake */
    const digitando =
        document.getElementById("digitando");

    digitando.classList.remove("hidden");


    setTimeout(() => {

        digitando.classList.add("hidden");

        msgs.push({
            texto: "Olá! Recebi sua mensagem 👍 Como posso ajudar?",
            eu: false,
            hora: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        });

        salvarMensagens(msgs);

        carregarMensagens();

    }, 1500);

}



/* ========= ENTER ========= */
function iniciarEventosChat() {

        const input =
            document.getElementById("chatInput");

        if (input) {

            input.addEventListener(
                "keypress",
                function (e) {

                    if (e.key === "Enter") {
                        e.preventDefault();
                        enviarMensagem();
                    }

                }
            );

        }


        /* botão do perfil */
        const btnPerfil =
            document.getElementById("btnChatPerfil");

        if (btnPerfil) {

            btnPerfil.onclick = function () {

                if (window.tecnicoSelecionado) {
                    abrirChat(window.tecnicoSelecionado);
                }

            };

        }

}

iniciarEventosChat();
