window.carregarAvaliacoes = carregarAvaliacoes;

function getAvaliacoes(nome) {
    return JSON.parse(localStorage.getItem("avaliacoes_" + nome)) || [];
}

function salvarAvaliacao(nome, nota, comentario) {
    const lista = getAvaliacoes(nome);

    lista.push({ nota, comentario });

    localStorage.setItem("avaliacoes_" + nome, JSON.stringify(lista));
}

function carregarAvaliacoes() {
    const container = document.getElementById("listaAvaliacoes");

    container.innerHTML = "";

    const avals = getAvaliacoes(tecnicoSelecionado.nome);

    avals.forEach(a => {
        container.innerHTML += `
        <div class="bg-gray-100 p-3 rounded-lg text-sm">
        <p class="text-yellow-500">⭐ ${a.nota}</p>
        <p class="text-gray-700">${a.comentario}</p>
        </div>
    `;
    });
}

document.getElementById("btnAvaliar").onclick = () => {
    const nota = document.getElementById("notaInput").value;
    const comentario = document.getElementById("comentarioInput").value;

    if (!comentario) return;

    salvarAvaliacao(tecnicoSelecionado.nome, nota, comentario);

    document.getElementById("comentarioInput").value = "";

    carregarAvaliacoes();
};