const titulosInput = document.getElementById("titulos");
const valoresInput = document.getElementById("valores");

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
  movimentacoes = [];
  atualizarTela();
}

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
  const titulos = titulosInput.value.split(",").map((t) => t.trim());

  const valores = valoresInput.value
    .replace(/\\s/g, "")
    .split(",")
    .map((v) => parseFloat(v));

  if (titulos.length !== valores.length) {
    alert("Quantidade diferente.");
    return;
  }

  for (let i = 0; i < titulos.length; i++) {
    movimentacoes.push({
      titulo: titulos[i],
      tipo: tipo,
      valor: valores[i],
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

  movimentacoes.forEach((item) => {
    lista.innerHTML += `
      <div class="
        flex justify-between
        bg-zinc-900
        p-3
        rounded-xl
      ">
        <span>${item.titulo}</span>

        <span>
          ${item.tipo} | R$${item.valor.toFixed(2)}
        </span>
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

document.getElementById("exportarMd").onclick = () => {
  let md = "# Resumo Financeiro\n\n";

  movimentacoes.forEach((item) => {
    md += `- ${item.titulo} | ${item.tipo} | R$${item.valor.toFixed(2)}\n`;
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
  let csv = "Titulo,Tipo,Valor\n";

  movimentacoes.forEach((item) => {
    csv += `${item.titulo},${item.tipo},${item.valor.toFixed(2)}\n`;
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

  const formatado = dataSP.replace(/\//g, "-");

  const nomeArquivo = `resumo_${formatado}.${extensao}`;

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

