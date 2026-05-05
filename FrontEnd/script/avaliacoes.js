window.carregarAvaliacoes = carregarAvaliacoes;

function getAvaliacoes(nome) {
    return JSON.parse(localStorage.getItem("avaliacoes_" + nome)) || [];
}

function salvarAvaliacao(nome, nota, comentario) {
    const lista = getAvaliacoes(nome);

    lista.push({
        cliente: "Cliente TechConnect",
        nota,
        comentario
    });

    localStorage.setItem("avaliacoes_" + nome, JSON.stringify(lista));
}

function estrelas(nota) {
    return "★".repeat(Number(nota)) + "☆".repeat(5 - Number(nota));
}

function carregarAvaliacoes() {
    const container = document.getElementById("listaAvaliacoes");
    if (!container || !window.tecnicoSelecionado) return;

    const avaliacoesFixas = window.tecnicoSelecionado.feedbacks || [];
    const avaliacoesLocais = getAvaliacoes(window.tecnicoSelecionado.nome);
    const avaliacoes = [...avaliacoesFixas, ...avaliacoesLocais];

    if (!avaliacoes.length) {
        container.innerHTML = `
        <div class="border border-slate-200 rounded-2xl p-4 text-sm text-slate-500">
          Este técnico ainda não recebeu avaliações.
        </div>
    `;
        return;
    }

    container.innerHTML = avaliacoes.map(a => `
        <div class="border border-slate-200 rounded-2xl p-4">
          <div class="flex items-center justify-between gap-3">
            <p class="font-semibold text-slate-900">${a.cliente || "Cliente TechConnect"}</p>
            <p class="text-yellow-500 text-sm">${estrelas(a.nota)}</p>
          </div>
          <p class="text-sm text-slate-600 mt-2 leading-relaxed">${a.comentario}</p>
        </div>
    `).join("");
}

document.getElementById("btnAvaliar").onclick = () => {
    const nota = document.getElementById("notaInput").value;
    const comentario = document.getElementById("comentarioInput").value.trim();

    if (!comentario || !window.tecnicoSelecionado) return;

    salvarAvaliacao(window.tecnicoSelecionado.nome, nota, comentario);

    document.getElementById("comentarioInput").value = "";

    carregarAvaliacoes();
};
