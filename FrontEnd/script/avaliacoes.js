function estrelas(nota) {
    return "★".repeat(Number(nota)) + "☆".repeat(5 - Number(nota));
}

function carregarAvaliacoes() {
    const container = document.getElementById("listaAvaliacoes");
    if (!container || !window.tecnicoSelecionado) return;

    const avaliacoes = window.tecnicoSelecionado.feedbacks || [];

    if (!avaliacoes.length) {
        container.innerHTML = `
            <div class="border border-slate-200 rounded-2xl p-4 text-sm text-slate-500">
                Este técnico ainda não recebeu avaliações.
            </div>`;
        return;
    }

    container.innerHTML = avaliacoes.map(a => `
        <div class="border border-slate-200 rounded-2xl p-4">
            <div class="flex items-center justify-between gap-3">
                <p class="font-semibold text-slate-900">${a.cliente || "Cliente TechConnect"}</p>
                <p class="text-yellow-500 text-sm">${estrelas(a.nota)}</p>
            </div>
            <p class="text-sm text-slate-600 mt-2 leading-relaxed">${a.comentario}</p>
        </div>`).join("");
}

function iniciarEventosAvaliacoes() {
    const btnAvaliar = document.getElementById("btnAvaliar");
    if (btnAvaliar) {
        btnAvaliar.onclick = () => {
            const nota = document.getElementById("notaInput").value;
            const comentario = document.getElementById("comentarioInput").value.trim();
            if (!comentario || !window.tecnicoSelecionado) return;

            // TODO: conectar ao POST /api/avaliacoes
            document.getElementById("comentarioInput").value = "";
            carregarAvaliacoes();
        };
    }
}