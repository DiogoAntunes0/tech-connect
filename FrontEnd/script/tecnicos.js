window.tecnicoSelecionado = null;

const tecnicos = [
{
nome:"Lucas Andrade",
area:"Suporte Técnico",
cidade:"São Paulo",
idade:28,
valor:120,
bio:"Especialista em suporte técnico com foco em empresas.",
foto:"https://i.pravatar.cc/150?img=1",
rating:4
},

{
nome:"Mariana Costa",
area:"Redes e Infraestrutura",
cidade:"Osasco",
idade:32,
valor:200,
bio:"Atuo com redes corporativas e servidores há mais de 10 anos.",
foto:"https://i.pravatar.cc/150?img=5",
rating:4.5
},

{
nome:"Bruno Reis",
area:"Desenvolvedor Full-Stack",
cidade:"Paulista",
idade:48,
valor:500,
bio:"Atuo como desenvolvedor Full-Stack há mais de 20 anos.",
foto:"https://i.pravatar.cc/150?img=18",
rating:5
}

];


/* ========= FAVORITOS ========= */

function getFavoritos(){
return JSON.parse(
localStorage.getItem("favoritos")
)||[];
}

function toggleFavorito(nome){

let favs = getFavoritos();

if(favs.includes(nome)){
favs = favs.filter(f=>f!==nome);
}
else{
favs.push(nome);
}

localStorage.setItem(
"favoritos",
JSON.stringify(favs)
);

renderTecnicos(
document.getElementById("searchInput").value
);

}



/* ========= LISTA ========= */

const lista =
document.getElementById(
"listaTecnicos"
);


function renderTecnicos(filtro=""){

lista.innerHTML=`
${[1,2,3].map(()=>`

<div class="bg-white p-5 rounded-2xl shadow animate-pulse">
<div class="h-5 bg-gray-200 rounded w-2/3 mb-3"></div>
<div class="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
<div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
<div class="h-8 bg-gray-200 rounded mt-4"></div>
</div>

`).join("")}
`;


setTimeout(()=>{

lista.innerHTML="";


tecnicos
.filter(
t=>t.area
.toLowerCase()
.includes(
filtro.toLowerCase()
)
)

.forEach(t=>{

lista.innerHTML += `

<div class="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition">

<div class="flex items-center justify-between mb-3">

<h3
onclick='abrirPerfil(${JSON.stringify(t)})'
class="font-bold text-lg cursor-pointer hover:text-indigo-600 transition"
>
${t.nome}
</h3>

<div class="flex items-center gap-2">

<span class="text-yellow-500 text-sm">
⭐ ${t.rating}
</span>

<button
onclick="toggleFavorito('${t.nome}')"
class="text-lg"
>
${getFavoritos().includes(t.nome)
? "❤️"
: "🤍"}
</button>

</div>

</div>


<p class="text-indigo-600 text-sm">
${t.area}
</p>

<p class="text-gray-500 text-sm mb-3">
${t.cidade}
</p>


<div class="flex justify-between items-center mt-4">

<span class="text-sm text-gray-400">
R$ ${t.valor}/h
</span>


<button
onclick='abrirChat(${JSON.stringify(t)})'
class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded-lg text-sm"
>
Contatar
</button>

</div>

</div>

`;

});

},600);

}


renderTecnicos();



/* ========= PERFIL ========= */

function abrirPerfil(tecnico){

if(!tecnico) return;


/* CORREÇÃO PRINCIPAL */
window.tecnicoSelecionado = tecnico;


document.getElementById(
"perfilNome"
).innerText = tecnico.nome;

document.getElementById(
"perfilArea"
).innerText = tecnico.area;

document.getElementById(
"perfilCidade"
).innerText = tecnico.cidade;

document.getElementById(
"perfilIdade"
).innerText = tecnico.idade;

document.getElementById(
"perfilValor"
).innerText = tecnico.valor;

document.getElementById(
"perfilRating"
).innerText = tecnico.rating;

document.getElementById(
"perfilBio"
).innerText = tecnico.bio;

document.getElementById(
"perfilFoto"
).src = tecnico.foto;



const drawer =
document.getElementById(
"perfilDrawer"
);

const box =
document.getElementById(
"drawerBox"
);


drawer.classList.remove(
"hidden"
);


/* força animação */
box.offsetHeight;


setTimeout(()=>{

box.classList.remove(
"translate-x-full"
);

},50);


if(typeof carregarAvaliacoes==="function"){
carregarAvaliacoes();
}

}



function fecharPerfil(){

const box =
document.getElementById(
"drawerBox"
);

box.classList.add(
"translate-x-full"
);


setTimeout(()=>{

document
.getElementById(
"perfilDrawer"
)
.classList.add(
"hidden"
);

},400);

}



/* ========= BUSCA ========= */

document
.getElementById("btnBuscar")
.onclick = ()=>{

const valor =
document.getElementById(
"searchInput"
).value;

renderTecnicos(valor);

document
.getElementById(
"listaTecnicos"
)
.scrollIntoView({
behavior:"smooth"
});

};