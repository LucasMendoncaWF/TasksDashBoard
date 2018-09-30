var appGerenciamento = angular.module("appGerenciamento", []);
appGerenciamento.controller("ctrlGerenciamento", ["$scope", function ($scope) {
        $scope.popupNovoBloco = false;
        $scope.addContadorPopUp = function () {
            $scope.popupNovoBloco = true;
        };
        $scope.projetosGeral = [];
        $scope.alimentaProjetosGerais = function () {
            $scope.projetosGeral = [];
            $scope.projetosGeral.push({ Cliente: 'Ajinomoto', Title: "Intranet", Gerente: "Valkíria", Tecnico: "Victor Santos", Tarefas: "10%", Entrega: '21/10/2018' }, { Cliente: 'Opty', Title: "Solicitações Médicas", Gerente: "Valkíria", Tecnico: "Victor Santos", Tarefas: "80%", Entrega: '12/10/2018' }, { Cliente: 'Racional', Title: "Intranet", Gerente: "Valkíria", Tecnico: "Victor Santos", Tarefas: "10%", Entrega: '15/10/2018' }, { Cliente: 'Ajinomoto', Title: "Suporte 40h", Gerente: "Valkíria", Tecnico: "Victor Santos", Tarefas: "30%", Entrega: '25/10/2018' });
        };
        $scope.dados = [];
        $scope.alimentaDados = function () {
            $scope.dados = [];
            $scope.dados.push({ Title: "Intranet", Cliente: "Ajinomoto", Concluidas: 10, Andamento: 20, Aguardo: 40, Vencidas: 30, Sobra: 0, DataInicio: '29/06/2018', DataPrazo: '01/06/2018', AtribuidoA: 'Renata Silva' }, { Title: "Solicitações Médicas", Cliente: "Opty", Concluidas: 30, Andamento: 10, Aguardo: 50, Vencidas: 10, Sobra: 0, DataInicio: '18/05/2018', DataPrazo: '22/05/2018', AtribuidoA: 'Paulo Jonas' }, { Title: "Intranet", Cliente: "Racional", Concluidas: 20, Andamento: 50, Aguardo: 20, Vencidas: 10, Sobra: 0, DataInicio: '25/08/2018', DataPrazo: '28/05/2018', AtribuidoA: 'Joana Souza' }, { Title: "Suporte 40h", Cliente: "Ajinomoto", Concluidas: 10, Andamento: 10, Aguardo: 70, Vencidas: 10, Sobra: 0, DataInicio: '12/05/2018', DataPrazo: '18/05/2018', AtribuidoA: 'João Carlos' });
        };
        $scope.clientes = [];
        $scope.alimentaClientes = function () {
            $scope.clientes = [];
            $scope.clientes.push({ Title: "Ajinomoto", Projetos: 2, HorasContratadas: 10, HorasRestantes: 2, HorasUsadas: "80%" }, { Title: "Racional", Projetos: 1, HorasContratadas: 10, HorasRestantes: 6, HorasUsadas: "60%" }, { Title: "Opty", Projetos: 1, HorasContratadas: 30, HorasRestantes: 5, HorasUsadas: "83%" });
        };
        $scope.projetos = [];
        $scope.alimentaProjetos = function () {
            $scope.projetos = [];
            $scope.projetos.push({ Title: "Intranet", Cliente: "Ajinomoto", HorasContratadas: 10, HorasRestantes: 2, HorasUsadas: "80%", DataInicio: '21/04/2018', DataPrazo: '26/12/2018', DataEntrega: 'Não Entregue', Atraso: 'Não' }, { Title: "Solicitações Médicas", Cliente: "Opty", HorasContratadas: 10, HorasRestantes: 6, HorasUsadas: "60%", DataInicio: '21/07/2018', DataPrazo: '22/09/2018', DataEntrega: 'Não Entregue', Atraso: 'Sim' }, { Title: "Intranet", Cliente: "Racional", HorasContratadas: 30, HorasRestantes: 5, HorasUsadas: "83%", DataInicio: '13/08/2018', DataPrazo: '12/12/2018', DataEntrega: 'Não Entregue', Atraso: 'Não' });
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
                $scope.alimentaClientes();
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
                $scope.alimentaProjetos();
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
        $scope.alimentaDados();
        $scope.alimentaProjetosGerais();
        $scope.alimentaContadores();
    }]);
