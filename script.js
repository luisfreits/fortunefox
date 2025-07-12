var telaAtual = 0;
var saldo = 1000.00;
var totalAposta = 0.00;
var foguetinhoAtivo = false;
var multiplicadorAtual = 0.00;
var intervalFoguetinho = null;
var apostouFoguetinho = false;
var valorApostadoFoguetinho = 0.00;

document.getElementById("valorAposta").addEventListener("input", function(e) {
    let input = e.target;
    let valor = input.value.replace(/\D/g, "");
    valor = (parseInt(valor, 10) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    input.value = `$ ${valor}`;
});

document.getElementById("valorApostaFoguetinho").addEventListener("input", function(e) {
    let input = e.target;
    let valor = input.value.replace(/\D/g, "");
    valor = (parseInt(valor, 10) / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    input.value = `$ ${valor}`;
});

function logar() {
    const user = document.getElementById(`user`).value;
    const senha = document.getElementById(`senha`).value;
    if (user && senha) {
        document.getElementById(`nomeUsuario`).textContent = user;
        document.getElementById(`telaLogin`).classList.remove(`ativa`);
        document.getElementById(`telaHome`).classList.add(`ativa`);
        telaAtual = 1;
    } else {
        alert("Usuário ou senha inválidos!");
    }
}

function voltar() {
    if (telaAtual == 1) {
        document.getElementById(`telaHome`).classList.remove(`ativa`);
        document.getElementById(`telaLogin`).classList.add(`ativa`);
        document.getElementById(`user`).value = ``;
        document.getElementById(`senha`).value = ``;
        telaAtual = 0;
    } else {
        document.getElementById(`financeiroJogos`).style.display = "none";
        document.getElementById(`painelFoguetinho`).style.display = "none";
        if (telaAtual == 2) {
            document.getElementById(`roleta`).innerHTML = ``;
            mostrarGrid();
            telaAtual = 1;
        } else if (telaAtual == 3) {
            if (foguetinhoAtivo) {
                clearInterval(intervalFoguetinho);
                foguetinhoAtivo = false;
            }
            document.getElementById(`foguetinho`).style.display = "none";
            resetarFoguetinho();
            mostrarGrid();
            telaAtual = 1;
        }
    }
}

function ocultarGrid() {
    document.getElementById(`fundoGrid`).style.display = `none`;
    const grids = document.getElementsByClassName(`grid-2x2`);
    for (let grid of grids) {
        grid.style.display = `none`;
    }
}

function mostrarGrid() {
    document.getElementById(`fundoGrid`).style.display = `flex`;
    const grids = document.getElementsByClassName(`grid-2x2`);
    for (let grid of grids) {
        grid.style.display = `grid`;
    }
}

function atualizarSaldo() {
    document.getElementById("saldo").textContent = `$ ${saldo.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    document.getElementById("valorApostando").textContent = `$ ${totalAposta.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function atualizarSaldoFoguetinho() {
    document.getElementById("saldoFoguetinho").textContent = `$ ${saldo.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
    document.getElementById("valorApostadoFoguetinho").textContent = `$ ${valorApostadoFoguetinho.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

atualizarSaldo();
atualizarSaldoFoguetinho();

function apostar(funcao) {
    const valorAposta = document.getElementById("valorAposta").value;
    const valorNumerico = parseFloat(valorAposta.replace(/[^0-9,-]+/g, "").replace(",", "."));
    if (funcao == 0) {
        if (isNaN(valorNumerico) || valorNumerico <= 0) {
            alert("Por favor, insira um valor válido para a aposta.");
            return;
        }
        if (valorNumerico > saldo) {
            alert("Saldo insuficiente para realizar esta aposta.");
            return;
        }
        saldo -= valorNumerico;
        totalAposta += valorNumerico;
        atualizarSaldo();
        atualizarSaldoFoguetinho();
        document.getElementById("valorAposta").value = `$ 0,00`;
        alert(`Aposta de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`);
    } else if (funcao == 1) {
        if (totalAposta <= 0) {
            alert("Não há valor apostado para retirar.");
            return;
        }
        saldo += totalAposta;
        totalAposta = 0;
        atualizarSaldo();
        atualizarSaldoFoguetinho();
        document.getElementById("valorAposta").value = `$ 0,00`;
        alert("Valor apostado transferido para o saldo!");
    }
}

function foguetinho() {
    telaAtual = 3;
    ocultarGrid();
    document.getElementById("painelFoguetinho").style.display = "block";
    document.getElementById("foguetinho").style.display = "flex";
    resetarFoguetinho();
    atualizarSaldoFoguetinho();
}

function resetarFoguetinho() {
    foguetinhoAtivo = false;
    multiplicadorAtual = 0.00;
    apostouFoguetinho = false;
    if (intervalFoguetinho) {
        clearInterval(intervalFoguetinho);
        intervalFoguetinho = null;
    }
    document.getElementById("multiplicadorDisplay").textContent = "0.00x";
    document.getElementById("multiplicadorDisplay").classList.remove("crash");
    document.getElementById("statusFoguetinho").textContent = "Faça sua aposta e clique em 'Decolar'!";
    document.getElementById("botaoDecolar").disabled = false;
    document.getElementById("botaoParar").disabled = true;
    document.getElementById("botaoNovoJogo").style.display = "none";
}

function iniciarFoguetinho() {
    if (valorApostadoFoguetinho <= 0) {
        alert("Você precisa fazer uma aposta primeiro!");
        return;
    }
    if (foguetinhoAtivo) return;
    foguetinhoAtivo = true;
    apostouFoguetinho = true;
    multiplicadorAtual = 0.00;
    document.getElementById("botaoDecolar").disabled = true;
    document.getElementById("botaoParar").disabled = false;
    document.getElementById("statusFoguetinho").textContent = "Foguete decolando... Clique em 'Parar' para sacar!";
    intervalFoguetinho = setInterval(() => {
        multiplicadorAtual += 0.05;
        multiplicadorAtual = Math.round(multiplicadorAtual * 100) / 100;
        document.getElementById("multiplicadorDisplay").textContent = multiplicadorAtual.toFixed(2) + "x";
        const crashChance = Math.random();
        if (crashChance < 0.15 || multiplicadorAtual >= 10.00) {
            crashFoguetinho();
        }
    }, 250);
}

function pararFoguetinho() {
    if (!foguetinhoAtivo || !apostouFoguetinho) return;
    clearInterval(intervalFoguetinho);
    foguetinhoAtivo = false;
    const ganho = valorApostadoFoguetinho * multiplicadorAtual;
    saldo += ganho;
    valorApostadoFoguetinho = 0;
    document.getElementById("statusFoguetinho").textContent = 
        `Parabéns! Você ganhou $ ${ganho.toFixed(2)} (${multiplicadorAtual.toFixed(2)}x)!`;
    document.getElementById("botaoParar").disabled = true;
    document.getElementById("botaoNovoJogo").style.display = "inline-block";
    atualizarSaldo();
    atualizarSaldoFoguetinho();
    alert(`Você sacou no multiplicador ${multiplicadorAtual.toFixed(2)}x e ganhou $ ${ganho.toFixed(2)}!`);
}

let contadorCliqueLogo = 0;
document.getElementById("logoHome").addEventListener("click", function() {
    contadorCliqueLogo++;

    if (contadorCliqueLogo >= 10) {
        contadorCliqueLogo = 0; // reseta o contador depois
        window.open("https://js-dos.com/games/doom.exe.html", "_blank");
        alert("DOOM liberado! 🚀");
    }
});

function crashFoguetinho() {
    clearInterval(intervalFoguetinho);
    foguetinhoAtivo = false;
    document.getElementById("multiplicadorDisplay").classList.add("crash");
    document.getElementById("statusFoguetinho").textContent = 
        `CRASH! O foguete explodiu em ${multiplicadorAtual.toFixed(2)}x. Você perdeu $ ${valorApostadoFoguetinho.toFixed(2)}.`;
    valorApostadoFoguetinho = 0;
    document.getElementById("botaoParar").disabled = true;
    document.getElementById("botaoNovoJogo").style.display = "inline-block";
    atualizarSaldo();
    atualizarSaldoFoguetinho();
    alert(`CRASH! O foguete explodiu em ${multiplicadorAtual.toFixed(2)}x. Você perdeu sua aposta!`);
}

async function roleta() {
    telaAtual = 2;
    ocultarGrid();
    document.getElementById("financeiroJogos").style.display = "block";
    let premios = ["-10%", "+10%", "-20%", "+20%", "-35%", "+35%", "-50%", "+50%", "-100%", "+100%"];
    let positivos = 0;
    let idx = 0;
    while (idx < premios.length) {
        if (premios[idx].includes("+")) positivos++;
        idx++;
    }
    console.log("Prêmios positivos:", positivos);
    premios.forEach(function(premio, i) {
        console.log(`Prêmio ${i + 1}: ${premio}`);
    });

    function criarRoleta(containerId, opcoes = {}, duracao) {
        const { width, height, items, colors, buttonLabel, zIndex } = opcoes;
        const container = document.getElementById(containerId);
        if (!container) return console.error("Contêiner da roleta não encontrado:", containerId);
        container.innerHTML = `
            <div class="roleta-container" style="z-index: ${zIndex}; position: relative;">
                <canvas width="${width}px" height="${height}px" style="margin-bottom: 10px;"></canvas><br/>
                <button class="botao-roleta">${buttonLabel}</button>
            </div>
        `;
        const canvas = container.querySelector("canvas");
        const button = container.querySelector("button");
        const ctx = canvas.getContext("2d");
        const raio = width / 2;
        let anguloAtual = 0;
        let girando = false;

        function desenharRoleta() {
            const anguloPorSegmento = 2 * Math.PI / items.length;
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < items.length; i++) {
                const anguloInicio = anguloAtual + i * anguloPorSegmento;
                const anguloFim = anguloInicio + anguloPorSegmento;
                ctx.beginPath();
                ctx.moveTo(raio, raio);
                ctx.arc(raio, raio, raio, anguloInicio, anguloFim);
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();
                ctx.save();
                ctx.translate(raio, raio);
                ctx.rotate(anguloInicio + anguloPorSegmento / 2);
                ctx.textAlign = "right";
                ctx.fillStyle = colors[i % colors.length * (-1) + 1];
                ctx.font = "bold 40px sans-serif";
                ctx.fillText(items[i], raio - 50, 10);
                ctx.restore();
            }
            ctx.fillStyle = "#000";
            ctx.beginPath();
            ctx.moveTo(raio, 10);
            ctx.lineTo(raio - 10, 30);
            ctx.lineTo(raio + 10, 30);
            ctx.closePath();
            ctx.fill();
        }

        desenharRoleta();
        return function girar() {
            return new Promise(resolve => {
                if (girando) return;
                girando = true;
                const DURACAO = duracao;
                const inicio = performance.now();
                const velocidadeInicial = Math.random() * 0.15 + 0.5;

                function animar(now) {
                    const tempoDecorrido = now - inicio;
                    const tempoRestante = DURACAO - tempoDecorrido;
                    let fator = tempoRestante / DURACAO;
                    if (fator < 0) fator = 0;
                    let velocidade = velocidadeInicial * fator * fator;
                    anguloAtual += velocidade;
                    anguloAtual %= 2 * Math.PI;
                    desenharRoleta();
                    if (tempoDecorrido < DURACAO) requestAnimationFrame(animar);
                    else {
                        girando = false;
                        const anguloPorSegmento = 2 * Math.PI / items.length;
                        const indice = Math.floor(((3 * Math.PI / 2 - anguloAtual + 2 * Math.PI) % (2 * Math.PI)) / anguloPorSegmento);
                        const resultado = items[indice];
                        resolve(resultado);
                    }
                }
                requestAnimationFrame(animar);
            });
        };
    }

    let screenW = Math.min(window.innerWidth, window.innerHeight);
    let diametro = screenW > 500 ? 400 : Math.floor(screenW * 0.9);
    let girarRoleta = criarRoleta("roleta", {
        width: diametro,
        height: diametro,
        items: premios,
        colors: ["#0f0f0f", "#ffeaa7"],
        buttonLabel: "Tentar a sorte",
        zIndex: 1000
    }, 8000);

    const botao = document.querySelector("#roleta button");
    botao.addEventListener("click", async () => {
        const resultado = await girarRoleta();
        const evento = new CustomEvent("roleta-finalizada", { detail: resultado });
        document.dispatchEvent(evento);
    });

    document.addEventListener("roleta-finalizada", (e) => {
        const resultado = e.detail;
        let percentual = parseFloat(resultado.replace("%", ""));
        if (isNaN(percentual)) percentual = 0;
        if (totalAposta > 0) {
            let valorFinal = totalAposta + (totalAposta * percentual / 100);
            let diferenca = valorFinal - totalAposta;
            saldo += valorFinal;
            totalAposta = 0;
            atualizarSaldo();
            atualizarSaldoFoguetinho();
            alert(`Você ${percentual < 0 ? "perdeu" : "ganhou"} ${Math.abs(percentual)}% da sua aposta!`);
        }
    });
}

function apostarFoguetinho() {
    const input = document.getElementById("valorApostaFoguetinho").value;
    const valorNumerico = parseFloat(input.replace(/[^0-9,-]+/g, "").replace(",", "."));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
        alert("Por favor, insira um valor válido para a aposta.");
        return;
    }
    if (valorNumerico > saldo) {
        alert("Saldo insuficiente para realizar esta aposta.");
        return;
    }
    saldo -= valorNumerico;
    valorApostadoFoguetinho = valorNumerico;
    atualizarSaldo();
    atualizarSaldoFoguetinho();
    document.getElementById("valorApostaFoguetinho").value = `$ 0,00`;
    alert(`Aposta de R$ ${valorNumerico.toFixed(2)} realizada com sucesso!`);
}