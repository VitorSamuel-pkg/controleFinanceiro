const titulosInput = document.getElementById("titulos");
const valoresInput = document.getElementById("valores");
const tipoPagamentoSelect = document.getElementById("tipoPagamento");

const lista = document.getElementById("lista");

const ganhosEl = document.getElementById("ganhos");
const gastosEl = document.getElementById("gastos");
const saldoEl = document.getElementById("saldo");
const historicoEl = document.getElementById("historico");

const btnGasto = document.getElementById("btnGasto");
const btnGanho = document.getElementById("btnGanho");

let tipo = "Gasto";
let movimentacoes = [];
let historicoDownloads = [];
let editingIndex = -1;
const adicionarBtn = document.getElementById("adicionar");

function atualizarHistorico() {
  historicoEl.innerHTML = "";

  historicoDownloads.forEach((item) => {
    historicoEl.innerHTML += `
      <div class="
        bg-zinc-800
        p-3
        rounded-2xl
        flex
        justify-between
        items-center
      ">

        <div>
          <p class="font-semibold">
            ${item.nome}
          </p>  

          <p class="text-sm text-zinc-400">
            ${item.data}
          </p>
        </div>

        <i class="fa-solid fa-download text-blue-400"></i>

      </div>
    `;
  });
}

document.getElementById("excluir").onclick = () => {
  if (movimentacoes.length === 0) {
    alert("Nada para excluir.");
    return;
  }

  if (!confirm("Excluir todas as movimentações?")) return;

  movimentacoes = [];
  atualizarTela();
};

btnGasto.onclick = () => {
  tipo = "Gasto";

  btnGasto.className = "flex-1 p-3 rounded-2xl bg-red-500";

  btnGanho.className = "flex-1 p-3 rounded-2xl bg-zinc-800";
};

btnGanho.onclick = () => {
  tipo = "Ganho";

  btnGanho.className = "flex-1 p-3 rounded-2xl bg-green-500";

  btnGasto.className = "flex-1 p-3 rounded-2xl bg-zinc-800";
};

document.getElementById("adicionar").onclick = () => {
  // Editing mode: update single item
  if (editingIndex !== -1) {
    const titulo = titulosInput.value.trim();
    const valor = parseFloat(valoresInput.value.replace(/\s/g, ""));

    if (!titulo) {
      alert("Informe o título.");
      return;
    }

    if (!valoresInput.value || isNaN(valor)) {
      alert("Informe um valor válido.");
      return;
    }

    movimentacoes[editingIndex] = {
      titulo,
      tipo,
      valor,
      forma: tipoPagamentoSelect.value,
    };

    editingIndex = -1;
    adicionarBtn.innerText = "Adicionar";
    titulosInput.value = "";
    valoresInput.value = "";
    atualizarTela();
    return;
  }

  // Add mode: support comma-separated entries
  if (!titulosInput.value.trim() || !valoresInput.value.trim()) {
    alert("Preencha títulos e valores antes de adicionar.");
    return;
  }

  const titulos = titulosInput.value.split(",").map((t) => t.trim());

  const valores = valoresInput.value
    .replace(/\\s/g, "")
    .split(",")
    .map((v) => parseFloat(v));

  if (titulos.length !== valores.length) {
    alert("Quantidade de títulos diferente da quantidade de valores.");
    return;
  }

  for (let i = 0; i < titulos.length; i++) {
    if (!titulos[i]) {
      alert("Um dos títulos está vazio.");
      return;
    }

    if (isNaN(valores[i])) {
      alert("Um dos valores não é um número válido.");
      return;
    }

    movimentacoes.push({
      titulo: titulos[i],
      tipo: tipo,
      valor: valores[i],
      forma: tipoPagamentoSelect.value,
    });
  }

  atualizarTela();

  titulosInput.value = "";
  valoresInput.value = "";
};

function atualizarTela() {
  lista.innerHTML = "";

  let ganhos = 0;
  let gastos = 0;

  movimentacoes.forEach((item, i) => {
    lista.innerHTML += `
      <div class="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mb-3">
  <div class="flex justify-between items-start mb-4">
    <div>
      <h3 class="font-bold text-white text-lg">${item.titulo}</h3>
      <div class="flex gap-2 mt-1">
        <span class="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">${item.tipo}</span>
        <span class="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">${item.forma}</span>
      </div>
    </div>
    <div class="text-right">
      <span class="text-white font-bold text-lg">R$ ${item.valor.toFixed(2)}</span>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-2">
    <button onclick="editarItem(${i})" class="bg-zinc-800 text-sm py-2 rounded-xl hover:bg-zinc-700 transition-colors">Editar</button>
    <button onclick="removerItem(${i})" class="bg-red-500/10 text-red-500 text-sm py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all">Excluir</button>
  </div>
</div>
    `;

    if (item.tipo === "Ganho") {
      ganhos += item.valor;
    } else {
      gastos += item.valor;
    }
  });

  ganhosEl.innerText = `R$${ganhos.toFixed(2)}`;
  gastosEl.innerText = `R$${gastos.toFixed(2)}`;
  saldoEl.innerText = `R$${(ganhos - gastos).toFixed(2)}`;
}

function editarItem(index) {
  const item = movimentacoes[index];
  if (!item) return;

  editingIndex = index;
  titulosInput.value = item.titulo;
  valoresInput.value = item.valor;
  tipo = item.tipo;

  // Update tipo buttons visual
  if (tipo === "Ganho") {
    btnGanho.className = "flex-1 p-3 rounded-2xl bg-green-500";
    btnGasto.className = "flex-1 p-3 rounded-2xl bg-zinc-800";
  } else {
    btnGasto.className = "flex-1 p-3 rounded-2xl bg-red-500";
    btnGanho.className = "flex-1 p-3 rounded-2xl bg-zinc-800";
  }

  tipoPagamentoSelect.value = item.forma;
  adicionarBtn.innerText = "Salvar";
}

function removerItem(index) {
  if (!confirm("Excluir esta movimentação?")) return;
  movimentacoes.splice(index, 1);
  // If we were editing this item, cancel edit
  if (editingIndex === index) {
    editingIndex = -1;
    adicionarBtn.innerText = "Adicionar";
    titulosInput.value = "";
    valoresInput.value = "";
  }
  atualizarTela();
}


document.getElementById("exportarMd").onclick = () => {
  if (movimentacoes.length === 0) {
    alert("Nada para exportar.");
    return;
  }
  let md = "# Resumo Financeiro\n\n";

  movimentacoes.forEach((item) => {
    md += `- ${item.titulo} | ${item.tipo} | ${item.forma} | R$${item.valor.toFixed(2)}\n`;
  });

  let ganhos = movimentacoes
    .filter((i) => i.tipo === "Ganho")
    .reduce((a, b) => a + b.valor, 0);

  let gastos = movimentacoes
    .filter((i) => i.tipo === "Gasto")
    .reduce((a, b) => a + b.valor, 0);

  md += `\n## Resumo\n`;
  md += `- Ganhos: R$${ganhos.toFixed(2)}\n`;
  md += `- Gastos: R$${gastos.toFixed(2)}\n`;
  md += `- Saldo: R$${(ganhos - gastos).toFixed(2)}\n`;

  baixarArquivo(md, "md", "text/markdown");
};

document.getElementById("exportarCsv").onclick = () => {
  if (movimentacoes.length === 0) {
    alert("Nada para exportar.");
    return;
  }
  let csv = "Data,Titulo,Tipo,Forma,Valor\n";
  
  const dataISO = new Date().toISOString().split("T")[0];

  movimentacoes.forEach((item) => {
    csv += `${dataISO},${item.titulo},${item.tipo},${item.forma},${item.valor.toFixed(2)}\n`;
  });

  baixarArquivo(csv, "csv", "text/csv");
};

function baixarArquivo(conteudo, extensao, tipoMime) {
  const blob = new Blob([conteudo], {
    type: `${tipoMime};charset=utf-8`,
  });

  const url = URL.createObjectURL(blob);

  const date = new Date();

  const dataSP = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

  const horaSP = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const formatado = dataSP.replace(/\//g, "-");
  const formatadoHora = horaSP.replace(/:/g, "hr");

  const nomeArquivo = `resumo_${formatado}_${formatadoHora}.${extensao}`;

  const a = document.createElement("a");

  a.href = url;
  a.download = nomeArquivo;

  a.click();

  URL.revokeObjectURL(url);

  historicoDownloads.unshift({
    nome: nomeArquivo,
    data: new Date().toLocaleString("pt-BR"),
  });

  atualizarHistorico();
}
