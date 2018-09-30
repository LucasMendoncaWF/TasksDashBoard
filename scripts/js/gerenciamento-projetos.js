var appGerenciamento = angular.module("appGerenciamento", []);
appGerenciamento.controller("ctrlGerenciamento", ["$scope", function ($scope) {
        var today = new Date();
        //Carrega os projetos existentes
        $scope.projetos = [];
        $scope.alimentaProjetos = function () {
            $scope.projetos = [];
            return $.ajax({
                url: "http://localhost:3000/Projetos", success: function (projetos) {
                    for (var _i = 0, projetos_1 = projetos; _i < projetos_1.length; _i++) {
                        var projeto = projetos_1[_i];
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
            return $.ajax({
                url: "http://localhost:3000/Clientes", success: function (clientes) {
                    for (var _i = 0, clientes_1 = clientes; _i < clientes_1.length; _i++) {
                        var cliente = clientes_1[_i];
                        var projetosCount = 0;
                        var horasUsadas = 0;
                        var horasContratadas = 0;
                        for (var _a = 0, _b = $scope.projetos; _a < _b.length; _a++) {
                            var projeto = _b[_a];
                            if (projeto.Cliente == cliente.Nome) {
                                projetosCount++;
                                horasUsadas += projeto.HorasUsadas;
                                horasContratadas += projeto.HorasContratadas;
                            }
                        }
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
            return $.ajax({
                url: "http://localhost:3000/Tarefas", success: function (tarefas) {
                    for (var _i = 0, tarefas_1 = tarefas; _i < tarefas_1.length; _i++) {
                        var tarefa = tarefas_1[_i];
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
                $scope.dados.push({ Title: projeto.Title, Cliente: projeto.Cliente, Concluidas: percentConcluida.toFixed(2) + "%", Andamento: percentAndamento.toFixed(2) + "%", Aguardo: percentAguardo.toFixed(2) + "%", Vencidas: percentvencida.toFixed(2) + "%" });
            }
            $scope.$apply();
        };
        $scope.contadores = [];
        $scope.alimentaContadores = function () {
            $scope.contadores = [];
            var totalTarefas = 0;
            for (var _i = 0, _a = $scope.dados; _i < _a.length; _i++) {
                var dados = _a[_i];
                totalTarefas += dados.Concluidas + dados.Andamento + dados.Aguardo + dados.Vencidas;
            }
            var totalAtrasadas = 0;
            for (var _b = 0, _c = $scope.dados; _b < _c.length; _b++) {
                var dados = _c[_b];
                totalAtrasadas += dados.Vencidas;
            }
            var totalAndamento = 0;
            for (var _d = 0, _e = $scope.dados; _d < _e.length; _d++) {
                var dados = _e[_d];
                totalAndamento += dados.Andamento;
            }
            var totalConcluido = 0;
            for (var _f = 0, _g = $scope.dados; _f < _g.length; _f++) {
                var dados = _g[_f];
                totalConcluido += dados.Concluidas;
            }
            $scope.contadores.push({ Title: "Total de tarefas", Quantidade: totalTarefas }, { Title: "Tarefas atrasadas", Quantidade: totalAtrasadas }, { Title: "Tarefas em andamento", Quantidade: totalAndamento }, { Title: "Tarefas concluídas", Quantidade: totalConcluido });
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
        $scope.popupNovoBloco = false;
        $scope.addContadorPopUp = function () {
            $scope.popupNovoBloco = true;
        };
    }]);
