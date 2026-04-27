/* ----------- TELAS ----------- */

function showScreen(tela){

const telas=[
"home",
"login",
"cadastro",
"perfilUsuario"
];

telas.forEach(id=>{
let el=document.getElementById(id);

if(el){
el.classList.add("hidden");
el.classList.remove("flex");
}

});


if(tela==="home"){
document.getElementById("home").classList.remove("hidden");
}


if(tela==="login"){
let login=document.getElementById("login");

login.classList.remove("hidden");
login.classList.add("flex");
}


if(tela==="cadastro"){
let cadastro=document.getElementById("cadastro");

cadastro.classList.remove("hidden");
cadastro.classList.add("flex");
}


if(tela==="perfilUsuario"){
document
.getElementById("perfilUsuario")
.classList.remove("hidden");
}

}



/* ---------- NAVEGAÇÃO ---------- */

btnLogin.onclick=()=>showScreen("login");

btnCadastro.onclick=()=>showScreen("cadastro");

voltarLogin.onclick=()=>showScreen("home");

voltarCadastro.onclick=()=>showScreen("home");

voltarPerfilUsuario.onclick=()=>showScreen("home");



/* ---------- STORAGE ---------- */

function getUser(){

return JSON.parse(
localStorage.getItem("user")
);

}


function setUser(user){

localStorage.setItem(
"user",
JSON.stringify(user)
);

}



/* ---------- LOGIN ---------- */

function loginUser(user){

localStorage.setItem(
"logado",
"true"
);

/* MOSTRAR NOME NO TOPO */
document.getElementById("userEmail").innerText =
user.usuario || user.nome || user.email;


/* AVATAR COM PRIMEIRA LETRA */
document.getElementById("userAvatar").innerText =
(user.usuario || user.email)
.charAt(0)
.toUpperCase();


document
.getElementById("navButtons")
.classList.add("hidden");


document
.getElementById("userArea")
.classList.remove("hidden");


showScreen("home");

}



/* ---------- CADASTRO ---------- */

fazerCadastro.onclick=()=>{

const usuario=cadUsuario.value;

const email=cadEmail.value;

const senha=cadSenha.value;


if(!usuario || !email || !senha){
return;
}


setUser({
usuario,
email,
senha
});


cadSucesso.classList.remove("hidden");


setTimeout(()=>{

showScreen("login");

},1200);

};



/* ---------- ENTRAR ---------- */

fazerLogin.onclick=()=>{

const email=loginEmail.value;

const senha=loginSenha.value;

const user=getUser();


if(
user &&
user.email===email &&
user.senha===senha
){

loginUser(user);

}

else{

loginErro.classList.remove("hidden");

}

};



/* ---------- LOGOUT ---------- */

btnLogout.onclick=()=>{

localStorage.removeItem("logado");

document
.getElementById("userArea")
.classList.add("hidden");

document
.getElementById("navButtons")
.classList.remove("hidden");

showScreen("home");

};



/* -------- PERFIL DO USUÁRIO -------- */

btnMeuPerfil.onclick=()=>{

const user=getUser();

if(!user) return;


perfilUserNome.innerText=user.usuario;

perfilUserEmail.innerText=user.email;


editarNome.value=user.usuario;

editarEmail.value=user.email;


perfilInicial.innerText=
user.usuario.charAt(0).toUpperCase();


showScreen("perfilUsuario");

};



/* -------- SALVAR PERFIL -------- */

salvarPerfilUsuario.onclick=()=>{

let user=getUser();

user.usuario=editarNome.value;

user.email=editarEmail.value;

setUser(user);


/* Atualiza topo */
userEmail.innerText=user.usuario;

userAvatar.innerText=
user.usuario.charAt(0).toUpperCase();


perfilSalvo.classList.remove("hidden");


setTimeout(()=>{

perfilSalvo.classList.add("hidden");

},2000);

};



/* ------- LOGIN GOOGLE DEMO ------- */

googleLogin.onclick=()=>{

let user={

usuario:"Usuário Google",

email:"google@usuario.com"

};

setUser(user);

loginUser(user);

};



/* ------- LOGIN GITHUB DEMO ------- */

githubLogin.onclick=()=>{

let user={

usuario:"Usuário GitHub",

email:"github@usuario.com"

};

setUser(user);

loginUser(user);

};



/* ------- sessão persistente ------- */

window.onload=()=>{

const logado=
localStorage.getItem("logado");

const user=getUser();

if(logado && user){

loginUser(user);

}

};