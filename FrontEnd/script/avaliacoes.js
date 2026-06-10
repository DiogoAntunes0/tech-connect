function estrelas(nota) {
    return "★".repeat(Number(nota)) + "☆".repeat(5 - Number(nota));
}

/* GET /api/avaliacoes/tecnico/:id */
async function carregarAvaliacoes() {
    const container = document.getElementById("listaAvaliacoes");
    if (!container || !window.tecnicoSelecionado?.id) return;

    container.innerHTML = `<div class="text-slate-400 text-sm animate-pulse">Carregando avaliações...</div>`;

    try {
        const res = await fetch(`${API}/api/avaliacoes/tecnico/${window.tecnicoSelecionado.id}`);
        if (!res.ok) throw new Error("Erro ao carregar avaliações");
        const avaliacoes = await res.json();

        if (!avaliacoes.length) {
            container.innerHTML = `
                <div class="border border-slate-200 rounded-2xl p-4 text-sm text-slate-500">
                    Este técnico ainda não recebeu avaliações. Seja o primeiro!
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
                ${a.criadoEm ? `<p class="text-xs text-slate-400 mt-2">${new Date(a.criadoEm).toLocaleDateString("pt-BR")}</p>` : ""}
            </div>`).join("");

    } catch (err) {
        console.error(err);
        container.innerHTML = `
            <div class="border border-red-100 rounded-2xl p-4 text-sm text-red-500">
                Não foi possível carregar as avaliações.
            </div>`;
    }
}

/* POST /api/avaliacoes */
function iniciarEventosAvaliacoes() {
    const btnAvaliar = document.getElementById("btnAvaliar");
    if (!btnAvaliar) return;

    btnAvaliar.onclick = async () => {
        const nota       = Number(document.getElementById("notaInput").value);
        const comentario = document.getElementById("comentarioInput").value.trim();
        if (!comentario || !window.tecnicoSelecionado?.id) return;

        const user = JSON.parse(localStorage.getItem("user"));

        const payload = {
            tecnicoId : window.tecnicoSelecionado.id,
            usuarioId : user?.id || null,
            nota,
            comentario
        };

        btnAvaliar.disabled = true;
        btnAvaliar.innerText = "Enviando...";

        try {
            const res = await fetch(`${API}/api/avaliacoes`, {
                method: "POST",
                headers: authHeader ? authHeader() : { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error("Erro ao enviar avaliação");

            document.getElementById("comentarioInput").value = "";
            await carregarAvaliacoes();
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar avaliação. Tente novamente.");
        } finally {
            btnAvaliar.disabled = false;
            btnAvaliar.innerText = "Enviar avaliação";
        }
    };
}
