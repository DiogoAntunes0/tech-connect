window.abrirChat = abrirChat;
window.fecharChat = fecharChat;
window.enviarMensagem = enviarMensagem;

let chatAtual = null;


// abrir
function abrirChat(tecnico){

chatAtual = tecnico;

document.getElementById("chatNome").innerText = tecnico.nome;
document.getElementById("chatArea").innerText = tecnico.area;

document.getElementById("chatAvatar").src =
tecnico.foto;

const chat = document.getElementById("chatBox");

chat.classList.remove("hidden");

setTimeout(()=>{
chat.classList.remove("translate-x-full");
},50);

carregarMensagens();

}


// fechar
function fecharChat(){

const chat = document.getElementById("chatBox");

chat.classList.add("translate-x-full");

setTimeout(()=>{
chat.classList.add("hidden");
},300);

}



// storage
function getMensagens(){
return JSON.parse(
localStorage.getItem(
"chat_"+chatAtual.nome
)
)||[];
}

function salvarMensagens(msgs){

localStorage.setItem(
"chat_"+chatAtual.nome,
JSON.stringify(msgs)
);

}



// render
function carregarMensagens(){

const container =
document.getElementById(
"chatMensagens"
);

container.innerHTML="";

const msgs = getMensagens();

msgs.forEach(m=>{

container.innerHTML += `

<div class="flex ${
m.eu ?
'justify-end'
:
'justify-start'
}">

<div class="
${m.eu
?
'bg-green-600 text-white rounded-br-md'
:
'bg-white border rounded-bl-md'
}

max-w-[75%]
px-4 py-3
rounded-2xl
shadow-sm">

<p class="text-sm">
${m.texto}
</p>

<p class="text-[10px] mt-1 opacity-70">
${m.hora}
</p>

</div>

</div>

`;

});

container.scrollTop=
container.scrollHeight;

}



// enviar
function enviarMensagem(){

const input =
document.getElementById(
"chatInput"
);

const texto =
input.value.trim();

if(!texto) return;

const msgs =
getMensagens();


msgs.push({
texto,
eu:true,
hora:new Date()
.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
})
});


salvarMensagens(msgs);

input.value="";

carregarMensagens();


// digitando fake
document
.getElementById("digitando")
.classList.remove("hidden");


setTimeout(()=>{

document
.getElementById("digitando")
.classList.add("hidden");


msgs.push({

texto:"Olá! Recebi sua mensagem 👍 Como posso ajudar?",

eu:false,

hora:new Date()
.toLocaleTimeString([],{
hour:'2-digit',
minute:'2-digit'
})

});


salvarMensagens(msgs);

carregarMensagens();

},1500);

}



// enter envia
document
.getElementById("chatInput")
.addEventListener(
"keypress",
function(e){

if(e.key==="Enter"){
enviarMensagem();
}

}
);


document
.getElementById("btnChatPerfil")
.onclick = ()=>{

abrirChat(
tecnicoSelecionado
);

};