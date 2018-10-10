//coloca mascara de porcentagem no campo de percentual
$('#percentual-campo').mask('##0,00%', { reverse: true });
//coloca mascara de data no campo de data
$("#datepicker").datepicker({
    dateFormat: 'dd/mm/yy'
});
//App angular
var appGerenciamento = angular.module("appGerenciamento", []);
appGerenciamento.controller("ctrlGerenciamento", ["$scope", function ($scope) {
        //data de hoje
        var today = new Date();
        //variaveis que definem visualização
        $scope.listaNaoSelecionada = true;
        $scope.popupNovoBloco = false;
        //Carrega os projetos existentes
        $scope.projetos = [];
        $scope.alimentaProjetos = function () {
            $scope.projetos = [];
            //consulta o arquivo json no site
            return $.ajax({
                url: "http://lucasmendoncapportfolio.atwebpages.com/json/projetos.json", success: function (projetos) {
                    var projetosObtidos = JSON.parse(projetos);
                    for (var _i = 0, _a = projetosObtidos['Projetos']; _i < _a.length; _i++) {
                        var projeto = _a[_i];
                        //calcula as horas restantes e a porcentagem de horas usadas em relação as contratadas
                        var horasrestantes = projeto.HorasContratadas - projeto.HorasUsadas;
                        var horasusadas = ((projeto.HorasUsadas * 100) / projeto.HorasContratadas).toFixed(2) + "%";
                        //caclula se o projeto esta atrasado ou não
                        var dataPrazo = projeto.Prazo.split('/');
                        var prazoDate = new Date(dataPrazo[1], dataPrazo[0], dataPrazo[2]);
                        var dataEntrega = projeto.Entrega != null ? projeto.Entrega.split('/') : null;
                        var atraso = '';
                        var entregue = '';
                        if (dataEntrega != null) {
                            entregue = projeto.Entrega;
                            atraso = (prazoDate) < (new Date(dataEntrega[1], dataEntrega[0], dataEntrega[2])) ? "Sim" : "Não";
                        }
                        else {
                            entregue = "Não Entregue";
                            atraso = prazoDate < today ? "Sim" : "Não";
                        }
                        //alimenta projetos na pagina
                        $scope.projetos.push({ Title: projeto.Nome, Cliente: projeto.Cliente, GerenteProjeto: projeto.GerenteProjeto, LiderTecnico: projeto.LiderTecnico, HorasContratadas: projeto.HorasContratadas, HorasRestantes: horasrestantes, HorasUsadas: projeto.HorasUsadas, HorasUsadasPercent: horasusadas, DataInicio: projeto.Inicio, DataPrazo: projeto.Prazo, DataEntrega: entregue, Atraso: atraso });
                    }
                }
            });
        };
        //Alimenta clientes na tabela de clientes
        $scope.clientes = [];
        $scope.alimentaClientes = function () {
            $scope.clientes = [];
            //consulta o arquivo json no site
            return $.ajax({
                url: "http://lucasmendoncapportfolio.atwebpages.com/json/clientes.json", success: function (clientes) {
                    var clientesObtidos = JSON.parse(clientes);
                    for (var _i = 0, _a = clientesObtidos['Clientes']; _i < _a.length; _i++) {
                        var cliente = _a[_i];
                        //Verifica quantidade de projetos, horas usadas e horas contratadas
                        var projetosCount = 0;
                        var horasUsadas = 0;
                        var horasContratadas = 0;
                        for (var _b = 0, _c = $scope.projetos; _b < _c.length; _b++) {
                            var projeto = _c[_b];
                            if (projeto.Cliente == cliente.Nome) {
                                projetosCount++;
                                horasUsadas += projeto.HorasUsadas;
                                horasContratadas += projeto.HorasContratadas;
                            }
                        }
                        //Define a porcentagel de horas usadas em relação sa horas contratadas
                        var horasRestantes = horasContratadas - horasUsadas;
                        var horasUsadasPercent = ((horasUsadas * 100) / horasContratadas).toFixed(2) + "%";
                        $scope.clientes.push({ Title: cliente.Nome, Projetos: projetosCount, HorasContratadas: horasContratadas, HorasRestantes: horasRestantes, HorasUsadas: horasUsadasPercent });
                    }
                }
            });
        };
        //Alimenta tarefas na tabela de tarefas
        $scope.tarefas = [];
        $scope.alimentaTarefas = function () {
            $scope.tarefas = [];
            //consulta o arquivo json no site
            return $.ajax({
                url: "http://lucasmendoncapportfolio.atwebpages.com/json/tarefas.json", success: function (tarefas) {
                    var tarefasObtiodas = JSON.parse(tarefas);
                    for (var _i = 0, _a = tarefasObtiodas['Tarefas']; _i < _a.length; _i++) {
                        var tarefa = _a[_i];
                        $scope.tarefas.push({ Projeto: tarefa.Projeto, Tarefa: tarefa.Tarefa, Atribuido: tarefa.Atribuido, Inicio: tarefa.Inicio, Entrega: tarefa.Entrega, Status: tarefa.Status });
                    }
                }
            });
        };
        //Alimenta tabela na página de dashboard
        $scope.projetosGeral = [];
        $scope.alimentaProjetosGerais = function () {
            $scope.projetosGeral = [];
            for (var _i = 0, _a = $scope.projetos; _i < _a.length; _i++) {
                var projeto = _a[_i];
                var tarefas = 0;
                var tarefasConcluidas = 0;
                for (var _b = 0, _c = $scope.tarefas; _b < _c.length; _b++) {
                    var tarefa = _c[_b];
                    if (projeto.Title == tarefa.Projeto) {
                        tarefas++;
                        if (tarefa.Status == "Concluida") {
                            tarefasConcluidas++;
                        }
                    }
                }
                var tarefasPercent = tarefas != 0 ? ((tarefasConcluidas * 100) / tarefas).toFixed(2) + "%" : "100%";
                $scope.projetosGeral.push({ Cliente: projeto.Cliente, Title: projeto.Title, Gerente: projeto.GerenteProjeto, Tecnico: projeto.LiderTecnico, Tarefas: tarefasPercent, Prazo: projeto.DataPrazo });
            }
        };
        //Alimenta grafico na página de dashboard
        $scope.dados = [];
        $scope.alimentaDados = function () {
            $scope.dados = [];
            for (var _i = 0, _a = $scope.projetos; _i < _a.length; _i++) {
                var projeto = _a[_i];
                var concluidas = 0, andamento = 0, aguardo = 0, vencidas = 0, sobra = 0, total = 0;
                for (var _b = 0, _c = $scope.tarefas; _b < _c.length; _b++) {
                    var tarefa = _c[_b];
                    if (projeto.Title == tarefa.Projeto) {
                        total++;
                        switch (tarefa.Status) {
                            case "Concluida":
                                concluidas++;
                                break;
                            case "Em Andamento":
                                andamento++;
                                break;
                            case "Em Aguardo":
                                aguardo++;
                                break;
                            case "Vencida":
                                vencidas++;
                                break;
                        }
                    }
                }
                var percentConcluida = concluidas != 0 ? (concluidas * 100) / total : 0;
                var percentAndamento = andamento != 0 ? (andamento * 100) / total : 0;
                var percentAguardo = aguardo != 0 ? (aguardo * 100) / total : 0;
                var percentvencida = vencidas != 0 ? (vencidas * 100) / total : 0;
                if (total == 0) {
                    percentConcluida = 100;
                }
                $scope.dados.push({ Title: projeto.Title, Cliente: projeto.Cliente, ConcluidasCount: concluidas, AndamentoCount: andamento, AguardoCount: aguardo, VencidasCount: vencidas, Concluidas: percentConcluida.toFixed(2) + "%", Andamento: percentAndamento.toFixed(2) + "%", Aguardo: percentAguardo.toFixed(2) + "%", Vencidas: percentvencida.toFixed(2) + "%" });
            }
            $scope.$apply();
            //Alimenta os contadores na pagina de dashboard
            $scope.alimentaContadores();
            return $scope.dados;
        };
        $scope.contadores = [];
        $scope.alimentaContadores = function () {
            $scope.contadores = [];
            var totalTarefas = 0;
            var totalConcluido = 0;
            var totalAtrasadas = 0;
            var totalAndamento = 0;
            var totalAguardo = 0;
            for (var _i = 0, _a = $scope.dados; _i < _a.length; _i++) {
                var dados = _a[_i];
                totalTarefas += dados.ConcluidasCount + dados.AndamentoCount + dados.AguardoCount + dados.VencidasCount;
                totalAtrasadas += dados.VencidasCount;
                totalAndamento += dados.AndamentoCount;
                totalConcluido += dados.ConcluidasCount;
                totalAguardo += dados.AguardoCount;
            }
            $scope.contadores.push({ Title: "Total de tarefas", Quantidade: totalTarefas }, { Title: "Tarefas atrasadas", Quantidade: totalAtrasadas }, { Title: "Tarefas em andamento", Quantidade: totalAndamento }, { Title: "Tarefas em aguardo", Quantidade: totalAguardo }, { Title: "Tarefas concluídas", Quantidade: totalConcluido });
            $scope.$apply();
            return $scope.contadores;
        };
        $scope.selectAba = function (aba) {
            if (aba == 'dashboard') {
                $scope.liDashboard = 'li-selecionada';
                $scope.liClientes = '';
                $scope.liProjetos = '';
                $scope.liTarefas = '';
                $scope.dashboardAba = 'aba-selecionada';
                $scope.clientesAba = 'aba-nao-selecionada';
                $scope.projetosAba = 'aba-nao-selecionada';
                $scope.tarefasAba = 'aba-nao-selecionada';
            }
            if (aba == 'clientes') {
                $scope.liDashboard = '';
                $scope.liClientes = 'li-selecionada';
                $scope.liProjetos = '';
                $scope.liTarefas = '';
                $scope.dashboardAba = 'aba-nao-selecionada';
                $scope.clientesAba = 'aba-selecionada';
                $scope.projetosAba = 'aba-nao-selecionada';
                $scope.tarefasAba = 'aba-nao-selecionada';
            }
            if (aba == 'projetos') {
                $scope.liDashboard = '';
                $scope.liClientes = '';
                $scope.liProjetos = 'li-selecionada';
                $scope.liTarefas = '';
                $scope.dashboardAba = 'aba-nao-selecionada';
                $scope.clientesAba = 'aba-nao-selecionada';
                $scope.projetosAba = 'aba-selecionada';
                $scope.tarefasAba = 'aba-nao-selecionada';
            }
            if (aba == 'tarefas') {
                $scope.liDashboard = '';
                $scope.liClientes = '';
                $scope.liProjetos = '';
                $scope.liTarefas = 'li-selecionada';
                $scope.dashboardAba = 'aba-nao-selecionada';
                $scope.clientesAba = 'aba-nao-selecionada';
                $scope.projetosAba = 'aba-nao-selecionada';
                $scope.tarefasAba = 'aba-selecionada';
            }
        };
        $scope.selectAba('dashboard');
        //chama função para alimentar projetos
        $scope.alimentaProjetos().done(function () {
            //chama função para alimentar clientes
            $scope.alimentaClientes().done(function () {
                //chama função para alimentar tarefas
                $scope.alimentaTarefas().done(function () {
                    //chama função para alimentar contadores
                    $scope.alimentaProjetosGerais();
                    $scope.alimentaDados();
                });
            });
        });
        $scope.addContadorPopUp = function () {
            $scope.popupNovoBloco = true;
        };
        $scope.opcoesColunas = [];
        $scope.exibeOpcoesColunas = function () {
            $scope.opcoesColunas = [];
            $scope.listaNaoSelecionada = false;
            switch ($scope.listaSelect) {
                case "Clientes":
                    $scope.opcoesColunas.push({
                        Title: "Nome",
                        Value: "Title",
                        Type: "texto"
                    }, {
                        Title: "Quantidade de Projetos",
                        Value: "Projetos",
                        Type: "numero"
                    }, {
                        Title: "Horas Contratadas",
                        Value: "HorasContratadas",
                        Type: "numero"
                    }, {
                        Title: "Horas Restantes",
                        Value: "HorasRestantes",
                        Type: "numero"
                    }, {
                        Title: "Horas Usadas (Percentual)",
                        Value: "HorasUsadas",
                        Type: "porcentagem"
                    });
                    break;
                case "Projetos":
                    $scope.opcoesColunas.push({
                        Title: "Nome",
                        Value: "Title",
                        Type: "texto"
                    }, {
                        Title: "Cliente",
                        Value: "Cliente",
                        Type: "texto"
                    }, {
                        Title: "Gerente do Projeto",
                        Value: "GerenteProjeto",
                        Type: "texto"
                    }, {
                        Title: "Lider Técnico do Projeto",
                        Value: "LiderTecnico",
                        Type: "texto"
                    }, {
                        Title: "Horas Contratadas",
                        Value: "HorasContratadas",
                        Type: "numero"
                    }, {
                        Title: "Horas Restantes",
                        Value: "HorasRestantes",
                        Type: "numero"
                    }, {
                        Title: "Horas Usadas",
                        Value: "HorasUsadas",
                        Type: "numero"
                    }, {
                        Title: "Horas Usadas (Percentual)",
                        Value: "HorasUsadasPercent",
                        Type: "porcentagem"
                    }, {
                        Title: "Data de Ínicio",
                        Value: "DataInicio",
                        Type: "data"
                    }, {
                        Title: "Data Prazo",
                        Value: "DataPrazo",
                        Type: "data"
                    }, {
                        Title: "Data de Entrega",
                        Value: "DataEntrega",
                        Type: "data"
                    }, {
                        Title: "Atraso (Sim/Não)",
                        Value: "Atraso",
                        Type: "sim/nao"
                    });
                    break;
                case "Tarefas":
                    $scope.opcoesColunas.push({
                        Title: "Nome",
                        Value: "Title",
                        Type: "texto"
                    }, {
                        Title: "Projeto",
                        Value: "Projeto",
                        Type: "texto"
                    }, {
                        Title: "Atribuido",
                        Value: "Atribuido",
                        Type: "texto"
                    }, {
                        Title: "Data de Ínicio",
                        Value: "Inicio",
                        Type: "data"
                    }, {
                        Title: "Data de Entrega",
                        Value: "Entrega",
                        Type: "data"
                    }, {
                        Title: "Status da Tarefa",
                        Value: "Status",
                        Type: "status"
                    });
                    break;
            }
        };
        $scope.comparacoes = [];
        $scope.alteraColuna = function () {
            $scope.comparacoes = [];
            $scope.comparacaoSelect = "";
            if ($scope.colunaSelect.Type != 'status' && $scope.colunaSelect.Type != 'sim/nao' && $scope.colunaSelect.Type != 'texto') {
                $scope.comparacoes.push({
                    Title: "Igual"
                }, {
                    Title: "Diferente"
                }, {
                    Title: "Maior"
                }, {
                    Title: "Menor"
                }, {
                    Title: "Maior ou Igual"
                }, {
                    Title: "Menor ou Igual"
                });
            }
            else {
                $scope.comparacoes.push({
                    Title: "Igual"
                }, {
                    Title: "Diferente"
                });
            }
        };
        $scope.alertCampos = false;
        $scope.salvarContador = function () {
            //------------------------------------------Clientes
            var listaCompare = [];
            if ($scope.listaSelect == "Clientes") {
                listaCompare = $scope.clientes;
            }
            //------------------------------------------Projetos
            if ($scope.listaSelect == "Projetos") {
                listaCompare = $scope.projetos;
            }
            //------------------------------------------Tarefas
            if ($scope.listaSelect == "Tarefas") {
                listaCompare = $scope.tarefas;
            }
            if ($scope.tituloBloco && $scope.listaSelect && $scope.colunaSelect && $scope.comparacaoSelect) {
                $scope.comparacao(listaCompare);
                $scope.alertCampos = false;
            }
            else {
                $scope.alertCampos = true;
            }
        };
        $scope.comparacao = function (listaCompare) {
            var totalcontador = 0;
            for (var _i = 0, listaCompare_1 = listaCompare; _i < listaCompare_1.length; _i++) {
                var comparacao = listaCompare_1[_i];
                if ($scope.colunaSelect.Type == "texto") {
                    if ($scope.comparacaoSelect.Title == "Igual") {
                        if (comparacao[$scope.colunaSelect.Value] == $scope.compararTexto) {
                            totalcontador++;
                        }
                    }
                    else {
                        if (comparacao[$scope.colunaSelect.Value] != $scope.compararTexto) {
                            totalcontador++;
                        }
                    }
                }
                else if ($scope.colunaSelect.Type == "status") {
                    if ($scope.comparacaoSelect.Title == "Igual") {
                        if (comparacao[$scope.colunaSelect.Value] == $scope.compararStatus) {
                            totalcontador++;
                        }
                    }
                    else {
                        if (comparacao[$scope.colunaSelect.Value] != $scope.compararStatus) {
                            totalcontador++;
                        }
                    }
                }
                else if ($scope.colunaSelect.Type == "sim/nao") {
                    if ($scope.comparacaoSelect.Title == "Igual") {
                        if (comparacao[$scope.colunaSelect.Value] == $scope.compararSimNao) {
                            totalcontador++;
                        }
                    }
                    else {
                        if (comparacao[$scope.colunaSelect.Value] != $scope.compararSimNao) {
                            totalcontador++;
                        }
                    }
                }
                else if ($scope.colunaSelect.Type == "numero") {
                    if ($scope.comparacaoSelect.Title == "Igual") {
                        if (comparacao[$scope.colunaSelect.Value] == $scope.compararNumero) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Diferente") {
                        if (comparacao[$scope.colunaSelect.Value] != $scope.compararNumero) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Maior") {
                        if (comparacao[$scope.colunaSelect.Value] > $scope.compararNumero) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Menor") {
                        if (comparacao[$scope.colunaSelect.Value] < $scope.compararNumero) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Maior ou Igual") {
                        if (comparacao[$scope.colunaSelect.Value] >= $scope.compararNumero) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Menor ou Igual") {
                        if (comparacao[$scope.colunaSelect.Value] <= $scope.compararNumero) {
                            totalcontador++;
                        }
                    }
                }
                else if ($scope.colunaSelect.Type == "porcentagem") {
                    var percentualSalvo = parseFloat(comparacao[$scope.colunaSelect.Value].split('%')[0]);
                    var newPercentual = parseFloat($scope.compararPorcentagem.split('%')[0]);
                    if ($scope.comparacaoSelect.Title == "Igual") {
                        if (percentualSalvo == newPercentual) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Diferente") {
                        if (percentualSalvo != newPercentual) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Maior") {
                        if (percentualSalvo > newPercentual) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Menor") {
                        if (percentualSalvo < newPercentual) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Maior ou Igual") {
                        if (percentualSalvo >= newPercentual) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Menor ou Igual") {
                        if (percentualSalvo <= newPercentual) {
                            totalcontador++;
                        }
                    }
                }
                else if ($scope.colunaSelect.Type == "data") {
                    var dataSavedSplited = comparacao[$scope.colunaSelect.Value].split('/');
                    var dataSaved = (new Date(dataSavedSplited[2], parseInt(dataSavedSplited[1]) - 1, dataSavedSplited[0])).getTime();
                    var dataNewSplited = $scope.compararData.split('/');
                    var dataNew = (new Date(dataNewSplited[2], parseInt(dataNewSplited[1]) - 1, dataNewSplited[0])).getTime();
                    if ($scope.comparacaoSelect.Title == "Igual") {
                        if (dataSaved == dataNew) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Diferente") {
                        if (dataSaved != dataNew) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Maior") {
                        if (dataSaved > dataNew) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Menor") {
                        if (dataSaved < dataNew) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Maior ou Igual") {
                        if (dataSaved >= dataNew) {
                            totalcontador++;
                        }
                    }
                    else if ($scope.comparacaoSelect.Title == "Menor ou Igual") {
                        if (dataSaved <= dataNew) {
                            totalcontador++;
                        }
                    }
                }
            }
            $scope.contadores.push({ Title: $scope.tituloBloco, Quantidade: totalcontador });
            $scope.cancelarContador();
        };
        $scope.cancelarContador = function () {
            $scope.popupNovoBloco = false;
            $scope.listaSelect = "";
            $scope.tituloBloco = "";
            $scope.colunaSelect = "";
            $scope.comparacaoSelect = "";
            $scope.compararTexto = "";
            $scope.compararPorcentagem = "";
            $scope.compararNumero = "";
            $scope.compararData = "";
            $scope.compararSimNao = "";
            $scope.compararStatus = "";
            $scope.listaNaoSelecionada = true;
        };
    }]);
