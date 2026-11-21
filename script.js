
const taxaEntrega = 6;
let carrinho = {};

const produtos = [];

const elTituloCat = document.getElementById("tituloCat");

const elBarraCarrinho = document.getElementById("barraCarrinho");
const elQtdBarra = document.getElementById("qtdBarra");
const elTotalBarra = document.getElementById("totalBarra");

const elFundoEscuro = document.getElementById("fundoEscuro");
const elPainel = document.getElementById("painel");
const elTelaPedido = document.getElementById("telaPedido");
const elTelaConfirmacao = document.getElementById("telaConfirmacao");
const elItensCarrinho = document.getElementById("itensCarrinho");

const elSubtotal = document.getElementById("subtotal");
const elTaxa = document.getElementById("taxa");
const elTotalFinal = document.getElementById("totalFinal");

const elCampoNome = document.getElementById("campoNome");
const elCampoEndereco = document.getElementById("campoEndereco");
const elCampoPagamento = document.getElementById("campoPagamento");
const elMsgErro = document.getElementById("msgErro");

const elBotaoTema = document.getElementById("botaoTema");
const elIconeTema = document.getElementById("iconeTema");

function carregarTema() {
    const temaSalvo = localStorage.getItem("temaBestBurger") || "claro";

    aplicarTema(temaSalvo);
}

function aplicarTema(tema) {
    document.documentElement.setAttribute("data-tema", tema);

    if (tema === "escuro") {
        elIconeTema.innerText = "☀️";
        elBotaoTema.setAttribute("aria-label", "Ativar modo claro");
    } else {
        elIconeTema.innerText = "🌙";
        elBotaoTema.setAttribute("aria-label", "Ativar modo escuro");
    }

    localStorage.setItem("temaBestBurger", tema);
}

function alternarTema() {
    const temaAtual = document.documentElement.getAttribute("data-tema");

    if (temaAtual === "escuro") {
        aplicarTema("claro");
    } else {
        aplicarTema("escuro");
    }
}

function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function buscarProduto(id) {
    return produtos.find(function (produto) {
        return produto.id === Number(id);
    });
}

function calcularCarrinho() {
    let quantidade = 0;
    let total = 0;

    for (const id in carrinho) {
        const produto = buscarProduto(id);

        quantidade += carrinho[id];
        total += carrinho[id] * produto.preco;
    }

    return {
        quantidade: quantidade,
        total: total
    };
}

function lerProdutosDoHtml() {
    const cards = document.querySelectorAll(".lanche");

    for (const card of cards) {
        const produto = {
            id: Number(card.dataset.id),
            nome: card.querySelector("h3").innerText,
            preco: Number(card.dataset.preco)
        };

        card.querySelector(".preco").innerText = formatarDinheiro(produto.preco);

        produtos.push(produto);
    }
}

function trocarCategoria(categoria) {
    elTituloCat.innerText = categoria;

    for (const card of document.querySelectorAll(".lanche")) {
        card.hidden = card.dataset.categoria !== categoria;
    }

    for (const aba of document.querySelectorAll(".aba")) {
        aba.classList.toggle("ativa", aba.dataset.categoria === categoria);
    }
}

function adicionarAoCarrinho(id) {
    carrinho[id] = (carrinho[id] || 0) + 1;

    atualizarCarrinho();
}

function removerDoCarrinho(id) {
    carrinho[id] = carrinho[id] - 1;

    if (carrinho[id] <= 0) {
        delete carrinho[id];
    }

    atualizarCarrinho();
}

function atualizarBarra() {
    const resumo = calcularCarrinho();

    elQtdBarra.innerText = resumo.quantidade + (
        resumo.quantidade === 1 ? " item" : " itens"
    );

    elTotalBarra.innerText = formatarDinheiro(resumo.total);

    if (resumo.quantidade > 0) {
        elBarraCarrinho.classList.add("mostrar");
    } else {
        elBarraCarrinho.classList.remove("mostrar");
    }
}

function atualizarCarrinho() {
    atualizarBarra();

    const painelAberto = elPainel.classList.contains("aberto");

    if (!painelAberto) return;

    if (calcularCarrinho().quantidade === 0) {
        fecharCarrinho();
    } else {
        mostrarItensDoCarrinho();
    }
}

function mostrarItensDoCarrinho() {
    const resumo = calcularCarrinho();

    let html = "";

    for (const id in carrinho) {
        const produto = buscarProduto(id);
        const subtotalItem = carrinho[id] * produto.preco;

        html += `
            <div class="item-carrinho">
                <div>
                    <strong>${produto.nome}</strong>

                    <div class="qtd">
                        <button type="button" aria-label="Diminuir" onclick="removerDoCarrinho(${id})">−</button>
                        <span>${carrinho[id]}</span>
                        <button type="button" aria-label="Aumentar" onclick="adicionarAoCarrinho(${id})">+</button>
                    </div>
                </div>

                <span>${formatarDinheiro(subtotalItem)}</span>
            </div>
        `;
    }

    elItensCarrinho.innerHTML = html;

    elSubtotal.innerText = formatarDinheiro(resumo.total);
    elTaxa.innerText = formatarDinheiro(taxaEntrega);
    elTotalFinal.innerText = formatarDinheiro(resumo.total + taxaEntrega);
}

function abrirCarrinho() {
    elTelaPedido.hidden = false;
    elTelaConfirmacao.hidden = true;
    elMsgErro.innerText = "";

    mostrarItensDoCarrinho();

    elFundoEscuro.classList.add("aberto");
    elPainel.classList.add("aberto");
    document.body.classList.add("sem-rolagem");

    document.getElementById("btnFechar").focus();
}

function fecharCarrinho() {
    elFundoEscuro.classList.remove("aberto");
    elPainel.classList.remove("aberto");
    document.body.classList.remove("sem-rolagem");
}

function finalizarPedido() {
    const nome = elCampoNome.value.trim();
    const endereco = elCampoEndereco.value.trim();

    if (nome === "" || endereco === "") {
        elMsgErro.innerText = "Preencha seu nome e o endereço.";
        return;
    }

    const numeroPedido = Math.floor(Math.random() * 9000) + 1000;

    document.getElementById("tituloConfirmacao").innerText =
        "Pedido #" + numeroPedido + " enviado!";

    document.getElementById("textoConfirmacao").innerText =
        "Valeu, " + nome + "! Seu pedido já está sendo preparado e chega em 30 a 45 minutos.";

    elTelaPedido.hidden = true;
    elTelaConfirmacao.hidden = false;

    carrinho = {};

    elCampoNome.value = "";
    elCampoEndereco.value = "";
    elCampoPagamento.value = "pix";

    atualizarBarra();
}

document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") {
        fecharCarrinho();
    }
});

carregarTema();
lerProdutosDoHtml();
trocarCategoria("Lanches");
