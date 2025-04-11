import { HTTPClient } from "./client";
import CicloPomodoroApi from "./cicloPomodoroApi";
import {StatusTarefa} from "./statusTarefa";

const TarefaApi = {

    async obterAsync(tarefaId) {
        try {
            const response = await HTTPClient.get(`/Tarefa/Obter/${tarefaId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter tarefa", error);
            throw error;
        }
    },
    async ObterUsuarioIdPorTarefaAsync(tarefaId) {
        try {
            const response = await HTTPClient.get(`/Tarefa/ObterUsuarioId/${tarefaId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter usuario", error);
            throw error;
        }
    },

    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Tarefa/Listar?ativos=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar tarefa", error);
            throw error;
        }
    },

    async criarAsync(titulo, descricao, materiaId, sprintId) {
        try {
            const tarefaCriar = {
                Titulo: titulo,
                Descricao: descricao,
                MateriaId: materiaId,
                SprintId: sprintId
            };
            //console.log("Objeto enviado:", tarefaCriar);
            const response = await HTTPClient.post(`/Tarefa/Criar`, tarefaCriar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao criar tarefa", error);
            throw error;
        }
    },

    async atualizarAsync(id, titulo, descricao, materiaId, sprintId, status) {
        try {
            const tarefaAtualizar = {
                Id: id,
                Titulo: titulo,
                Descricao: descricao,
                MateriaId: materiaId,
                SprintId: sprintId,
                Status: status
            };
            console.log("Objeto enviado:", tarefaAtualizar);
            const response = await HTTPClient.put(`/Tarefa/Atualizar`, tarefaAtualizar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao atualizar tarefa", error);
            throw error;
        }
    },

    async deletarAsync(tarefaId) {
        try {
            const response = await HTTPClient.delete(`/Tarefa/Deletar/${tarefaId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao deletar tarefa", error);
            throw error;
        }
    },

    async listarPorUsuarioAsync(usuarioId, ativos) {
        try {
            const response = await HTTPClient.get(`/Tarefa/ListarPorUsuario/${usuarioId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar tarefa", error);
            throw error;
        }
    },

    async listarPorMateriaAsync(materiaId, ativos) {
        try {
            const response = await HTTPClient.get(`/Tarefa/ListarPorMateria/${materiaId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar tarefa", error);
            throw error;
        }
    },

    async listarPorSprintAsync(sprintId, ativos) {
        try {
            const response = await HTTPClient.get(`/Tarefa/ListarPorSprint/${sprintId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar tarefa", error);
            throw error;
        }
    },

    async restaurarAsync(tarefaId) {
        try {
            const response = await HTTPClient.put(`/Tarefa/Restaurar/${tarefaId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao restaurar tarefa", error);
            throw error;
        }
    },

    async listarStatusTarefaAsync() {
        try {
            const response = await HTTPClient.get(`/Tarefa/ListarStatusTarefa`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar status de tarefa", error);
            throw error;
        }
    },

    async listarComProgresso(sprintId) {
        try {
          const [tarefas, ciclos] = await Promise.all([
            this.listarPorSprintAsync(sprintId, true),
            CicloPomodoroApi.listarPorSprintAsync(sprintId, true)
          ]);
    
          return tarefas.map(tarefa => {
            const horas = ciclos
              .filter(c => c.tarefaId === tarefa.id)
              .reduce((sum, c) => sum + c.duracao, 0) / 60;
              
            return {
              ...tarefa,
              horasRealizadas: horas,
              concluida: tarefa.status === StatusTarefa.Concluida
            };
          });
        } catch (error) {
          console.error("Erro ao listar tarefas com progresso:", error);
          throw error;
        }
      }
}

export default TarefaApi;

/* <Select
  options={status.map(s => ({ value: s.id, label: s.nome }))}
  onChange={...}
/> */