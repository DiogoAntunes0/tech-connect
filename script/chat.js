window.abrirChat = abrirChat;
window.fecharChat = fecharChat;
window.enviarMensagem = enviarMensagem;

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