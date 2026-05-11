const titulosInput = document.getElementById("titulos");
const valoresInput = document.getElementById("valores");

const lista = document.getElementById("lista");

const ganhosEl = document.getElementById("ganhos");
const gastosEl = document.getElementById("gastos");
const saldoEl = document.getElementById("saldo");

const btnGasto = document.getElementById("btnGasto");
const btnGanho = document.getElementById("btnGanho");

let tipo = "gasto";

let movimentacoes = [];

btnGasto.onclick = () => {
  tipo = "gasto";

  btnGasto.className =
    "flex-1 p-3 rounded-2xl bg-red-500";

  btnGanho.className =
    "flex-1 p-3 rounded-2xl bg-zinc-800";
};

btnGanho.onclick = () => {
  tipo = "ganho";

  btnGanho.className =
    "flex-1 p-3 rounded-2xl bg-green-500";

  btnGasto.className =
    "flex-1 p-3 rounded-2xl bg-zinc-800";
};

document.getElementById("adicionar").onclick = () => {

  const titulos = titulosInput.value
    .split(",")
    .map(t => t.trim());

  const valores = valoresInput.value
    .replace(/\\s/g, "")
    .split(",")
    .map(v => parseFloat(v));

  if (titulos.length !== valores.length) {
    alert("Quantidade diferente.");
    return;
  }

  for (let i = 0; i < titulos.length; i++) {

    movimentacoes.push({
      titulo: titulos[i],
      tipo: tipo,
      valor: valores[i]
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

  movimentacoes.forEach(item => {

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

    if (item.tipo === "ganho") {
      ganhos += item.valor;
    } else {
      gastos += item.valor;
    }

  });

  ganhosEl.innerText = `R$${ganhos.toFixed(2)}`;
  gastosEl.innerText = `R$${gastos.toFixed(2)}`;
  saldoEl.innerText = `R$${(ganhos - gastos).toFixed(2)}`;
}

document.getElementById("exportar").onclick = () => {

  let md = "# Resumo Financeiro\n\n";

  movimentacoes.forEach(item => {

    md += `- ${item.titulo} | ${item.tipo} | R$${item.valor.toFixed(2)}\n`;

  });

  let ganhos = movimentacoes
    .filter(i => i.tipo === "ganho")
    .reduce((a, b) => a + b.valor, 0);

  let gastos = movimentacoes
    .filter(i => i.tipo === "gasto")
    .reduce((a, b) => a + b.valor, 0);

  md += `\n## Resumo\n`;
  md += `- Ganhos: R$${ganhos.toFixed(2)}\n`;
  md += `- Gastos: R$${gastos.toFixed(2)}\n`;
  md += `- Saldo: R$${(ganhos - gastos).toFixed(2)}\n`;

  const blob = new Blob([md], {
    type: "text/markdown; charset=utf-8"
  });

  const url = URL.createObjectURL(blob);

  const date = new Date();

    const dataSP = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);

    const formatado = dataSP
      .replace(/\//g, "-")
      .replace(",", "-")

  const a = document.createElement("a");

  a.href = url;
  a.download = `resumo_${formatado}.md`;  

  a.click();

  URL.revokeObjectURL(url);
};