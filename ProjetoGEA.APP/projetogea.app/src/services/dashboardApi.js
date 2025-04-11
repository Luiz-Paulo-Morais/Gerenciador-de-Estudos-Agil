import TarefaApi from "./tarefaApi";
import CicloPomodoroApi from "./cicloPomodoroApi";
import MetaEstudoApi from "./metaEstudoApi";
import SimuladoApi from "./_simuladoApi";

const DashboardApi = {
  async obterDadosConsolidados(usuarioId, sprintId = null) {
    try {
      if (typeof usuarioId !== 'number') {
        throw new Error('ID do usuário deve ser um número');
      }

      if (sprintId !== null && typeof sprintId !== 'number') {
        throw new Error('ID da sprint deve ser um número ou null');
      }

      const [metas, tarefas, ciclos] = await Promise.all([
        sprintId
          ? MetaEstudoApi.listarPorSprintAsync(sprintId, true)
          : MetaEstudoApi.listarPorUsuarioAsync(usuarioId, true),

        sprintId
          ? TarefaApi.listarPorSprintAsync(sprintId, true)
          : TarefaApi.listarPorUsuarioAsync(usuarioId, true),

        sprintId
          ? CicloPomodoroApi.listarPorSprintAsync(sprintId, true)
          : CicloPomodoroApi.listarPorUsuarioAsync(usuarioId, true)
      ]);

      const simulados = await SimuladoApi.listarPorUsuarioAsync(usuarioId, true);

      const tarefasConcluidas = tarefas.filter(t => t.status === 2).length;

      const metricas = {
        horasPlanejadas: metas.reduce((sum, meta) => sum + meta.horasPlanejadas, 0),
        horasRealizadas: ciclos.reduce((sum, ciclo) => sum + ciclo.duracao, 0) / 60,
        tarefasConcluidas: tarefasConcluidas,
        totalTarefas: tarefas.length,
        eficiencia: 0
      };

      metricas.eficiencia = metricas.horasPlanejadas > 0
        ? (metricas.horasRealizadas / metricas.horasPlanejadas) * 100
        : 0;

      const metricasSimulados = {
        totalSimulados: simulados.length,
        totalQuestoes: simulados.reduce((sum, s) => sum + s.totalQuestoes, 0),
        totalAcertos: simulados.reduce((sum, s) => sum + s.totalAcertos, 0),
        taxaAcerto: simulados.length > 0
          ? (simulados.reduce((sum, s) => sum + s.totalAcertos, 0) /
             simulados.reduce((sum, s) => sum + s.totalQuestoes, 0)) * 100
          : 0,
        melhorDesempenho: simulados.length > 0
          ? Math.max(...simulados.map(s => (s.totalAcertos / s.totalQuestoes) * 100))
          : 0
      };

      return {
        metas: metas.map(meta => {
          const horasMeta = ciclos
            .filter(c => c.materiaId === meta.materiaId &&
              (!sprintId || c.sprintId === sprintId))
            .reduce((sum, ciclo) => sum + ciclo.duracao, 0) / 60;

          return {
            ...meta,
            horasRealizadas: horasMeta,
            progresso: meta.horasPlanejadas > 0
              ? Math.min(100, (horasMeta / meta.horasPlanejadas) * 100)
              : 0
          };
        }),

        tarefas: tarefas.map(tarefa => {
          const horasTarefa = ciclos
            .filter(c => c.tarefaId === tarefa.id)
            .reduce((sum, ciclo) => sum + ciclo.duracao, 0) / 60;

          return {
            ...tarefa,
            horasRealizadas: horasTarefa,
            concluida: tarefa.status === 2
          };
        }),

        simulados: simulados.map(s => ({
          ...s,
          taxaAcerto: (s.totalAcertos / s.totalQuestoes) * 100,
          dataFormatada: new Date(s.dataAplicacao).toLocaleDateString(),
          materiaNome: metas.find(m => m.materiaId === s.materiaId)?.nomeMateria || 'Geral'
        })),

        metricas: {
          ...metricas,
          simulados: metricasSimulados
        }
      };

    } catch (error) {
      console.error("Erro ao obter dados consolidados:", error);
      throw error;
    }
  }
};

export default DashboardApi;
