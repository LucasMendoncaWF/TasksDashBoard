var appGerenciamento = angular.module("appGerenciamento", []);
appGerenciamento.controller("ctrlGerenciamento", ["$scope", ($scope) => {

  let today = new Date();

  //Carrega os projetos existentes
  $scope.projetos = [];
  $scope.alimentaProjetos = () => {
    $scope.projetos = [];
    return $.ajax({
      url: "http://localhost:3000/Projetos", success: function (projetos) {
        for (let projeto of projetos) {
          //calcula as horas restantes e a porcentagem de horas usadas em relação as contratadas
          let horasrestantes = projeto.HorasContratadas - projeto.HorasUsadas;
          let horasusadas = ((projeto.HorasUsadas * 100) / projeto.HorasContratadas).toFixed(2) + "%";
          //caclula se o projeto esta atrasado ou não
          let dataPrazo = projeto.Prazo.split('/');
          let prazoDate = new Date(dataPrazo[1], dataPrazo[0], dataPrazo[2]);
          let dataEntrega = projeto.Entrega != null ? projeto.Entrega.split('/') : null;
          let atraso = '';
          let entregue = '';
          if (dataEntrega != null) {
            entregue = projeto.Entrega;
            atraso = (prazoDate) < (new Date(dataEntrega[1], dataEntrega[0], dataEntrega[2])) ? "Sim" : "Não";
          } else {
            entregue = "Não Entregue";
            atraso = prazoDate < today ? "Sim" : "Não";
          }
          //alimenta projetos na pagina
          $scope.projetos.push(
            { Title: projeto.Nome, Cliente: projeto.Cliente, GerenteProjeto: projeto.GerenteProjeto, LiderTecnico: projeto.LiderTecnico, HorasContratadas: projeto.HorasContratadas, HorasRestantes: horasrestantes, HorasUsadas: projeto.HorasUsadas, HorasUsadasPercent: horasusadas, DataInicio: projeto.Inicio, DataPrazo: projeto.Prazo, DataEntrega: entregue, Atraso: atraso },
          );
        }
      }
    });
  }
  //Alimenta clientes na tabela de clientes
  $scope.clientes = [];
  $scope.alimentaClientes = () => {
    $scope.clientes = [];
    return $.ajax({
      url: "http://localhost:3000/Clientes", success: function (clientes) {
        for (let cliente of clientes) {
          let projetosCount = 0;
          let horasUsadas = 0;
          let horasContratadas = 0;
          for (let projeto of $scope.projetos) {
            if (projeto.Cliente == cliente.Nome) {
              projetosCount++;
              horasUsadas += projeto.HorasUsadas;
              horasContratadas += projeto.HorasContratadas;
            }
          }
          let horasRestantes = horasContratadas - horasUsadas;
          let horasUsadasPercent = ((horasUsadas * 100) / horasContratadas).toFixed(2) + "%";
          $scope.clientes.push(
            { Title: cliente.Nome, Projetos: projetosCount, HorasContratadas: horasContratadas, HorasRestantes: horasRestantes, HorasUsadas: horasUsadasPercent }
          );
        }
      }
    });
  }
  //Alimenta tarefas na tabela de tarefas
  $scope.tarefas = [];
  $scope.alimentaTarefas = () => {
    $scope.tarefas = [];
    return $.ajax({
      url: "http://localhost:3000/Tarefas", success: function (tarefas) {
        for (let tarefa of tarefas) {
          $scope.tarefas.push({ Projeto: tarefa.Projeto, Tarefa: tarefa.Tarefa, Atribuido: tarefa.Atribuido, Inicio: tarefa.Inicio, Entrega: tarefa.Entrega, Status: tarefa.Status });
        }
      }
    });
  }
  //Alimenta tabela na página de dashboard
  $scope.projetosGeral = [];
  $scope.alimentaProjetosGerais = () => {
    $scope.projetosGeral = [];
    for (let projeto of $scope.projetos) {
      let tarefas = 0;
      let tarefasConcluidas = 0;
      for (let tarefa of $scope.tarefas) {
        if (projeto.Title == tarefa.Projeto) {
          tarefas++;
          if (tarefa.Status == "Concluida") {
            tarefasConcluidas++;
          }
        }
      }
      let tarefasPercent = tarefas != 0 ? ((tarefasConcluidas * 100) / tarefas).toFixed(2) + "%" : "100%";
      $scope.projetosGeral.push(
        { Cliente: projeto.Cliente, Title: projeto.Title, Gerente: projeto.GerenteProjeto, Tecnico: projeto.LiderTecnico, Tarefas: tarefasPercent, Prazo: projeto.DataPrazo },
      );
    }
  }
  //Alimenta grafico na página de dashboard
  $scope.dados = [];
  $scope.alimentaDados = () => {
    $scope.dados = [];
    for (let projeto of $scope.projetos) {
      let concluidas = 0, andamento = 0, aguardo = 0, vencidas = 0, sobra = 0, total = 0;
      for (let tarefa of $scope.tarefas) {
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
      let percentConcluida = concluidas != 0 ? (concluidas * 100) / total : 0;
      let percentAndamento = andamento != 0 ? (andamento * 100) / total : 0;
      let percentAguardo = aguardo != 0 ? (aguardo * 100) / total : 0;
      let percentvencida = vencidas != 0 ? (vencidas * 100) / total : 0;
      if (total == 0) {
        percentConcluida = 100;
      }
      $scope.dados.push(
        { Title: projeto.Title, Cliente: projeto.Cliente, Concluidas: percentConcluida.toFixed(2) + "%", Andamento: percentAndamento.toFixed(2) + "%", Aguardo: percentAguardo.toFixed(2) + "%", Vencidas: percentvencida.toFixed(2) + "%" }
      );
    }
    $scope.$apply();
  }

  $scope.contadores = [];
  $scope.alimentaContadores = () => {
    $scope.contadores = [];
    var totalTarefas = 0;
    for (var dados of $scope.dados) {
      totalTarefas += dados.Concluidas + dados.Andamento + dados.Aguardo + dados.Vencidas;
    }
    var totalAtrasadas = 0;
    for (var dados of $scope.dados) {
      totalAtrasadas += dados.Vencidas;
    }
    var totalAndamento = 0;
    for (var dados of $scope.dados) {
      totalAndamento += dados.Andamento;
    }
    var totalConcluido = 0;
    for (var dados of $scope.dados) {
      totalConcluido += dados.Concluidas;
    }
    $scope.contadores.push(
      { Title: "Total de tarefas", Quantidade: totalTarefas },
      { Title: "Tarefas atrasadas", Quantidade: totalAtrasadas },
      { Title: "Tarefas em andamento", Quantidade: totalAndamento },
      { Title: "Tarefas concluídas", Quantidade: totalConcluido });
    $scope.$apply();
    return $scope.contadores;
  }

  $scope.selectAba = (aba) => {
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
  }

  $scope.selectAba('dashboard');
  //chama função para alimentar projetos
  $scope.alimentaProjetos().done(() => {
    //chama função para alimentar clientes
    $scope.alimentaClientes().done(() => {
      //chama função para alimentar tarefas
      $scope.alimentaTarefas().done(() => {
        //chama função para alimentar contadores
        $scope.alimentaProjetosGerais();
        $scope.alimentaDados();
      });
    });
  });

  $scope.popupNovoBloco = false;

  $scope.addContadorPopUp = () => {
    $scope.popupNovoBloco = true;
  }

}]);