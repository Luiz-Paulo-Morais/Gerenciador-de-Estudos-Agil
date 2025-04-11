import { HTTPClient } from "./client";
import CicloPomodoroApi from "./cicloPomodoroApi";

const MetaEstudoApi = {

    async obterAsync(metaEstudoId) {
        try {
            const response = await HTTPClient.get(`/MetaEstudo/Obter/${metaEstudoId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter Meta de Estudo", error);
            throw error;
        }
    },        

    async AdicionarAsync(usuarioId, sprintId, materiaId, horasPlanejadas) {
        try {
            const metaEstudoAdicionar = {
                UsuarioId: usuarioId,
                SprintId: sprintId,
                MateriaId: materiaId,
                HorasPlanejadas: horasPlanejadas
            };
            //console.log("Objeto enviado:", metaEstudoAdicionar);
            const response = await HTTPClient.post(`/MetaEstudo/Adicionar`, metaEstudoAdicionar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao adiconar Meta de Estudo", error);
            throw error;
        }
    },

    async atualizarAsync(id, usuarioId, sprintId, materiaId, horasPlanejadas) {
        try {
            const metaEstudoAtualizar = {
                Id: id,
                UsuarioId: usuarioId,
                SprintId: sprintId,
                MateriaId: materiaId,
                HorasPlanejadas: horasPlanejadas
            };
            console.log("Objeto enviado Meta Estudo:", metaEstudoAtualizar);
            const response = await HTTPClient.put(`/MetaEstudo/Atualizar`, metaEstudoAtualizar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao atualizar Meta de Estudo", error);
            throw error;
        }
    },

    async deletarAsync(metaEstudoId) {
        try {
            const response = await HTTPClient.delete(`/MetaEstudo/Deletar/${metaEstudoId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao deletar Meta Estudo", error);
            throw error;
        }
    },

    async listarPorUsuarioAsync(usuarioId, ativos) {
        try {
            console.log("Usuario buscar Meta:", usuarioId);
            const response = await HTTPClient.get(`/MetaEstudo/ListarPorUsuario/${usuarioId}?ativo=${ativos}`);
            console.log("Resposta da API:", response.data);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Meta de Estudo", error);
            throw error;
        }
    },

    async listarPorMateriaAsync(materiaId, ativos) {
        try {
            const response = await HTTPClient.get(`/MetaEstudo/ListarPorMateria/${materiaId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Meta de Estudo", error);
            throw error;
        }
    },
    async listarPorSprintAsync(sprintId, ativos) {
        try {
            const response = await HTTPClient.get(`/MetaEstudo/ListarPorSprint/${sprintId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Meta de Estudo", error);
            throw error;
        }
    },

    async obterComProgresso(usuarioId, sprintId = null) {
        try {
          const [metas, ciclos] = await Promise.all([
            sprintId
              ? this.listarPorSprintAsync(sprintId, true)
              : this.listarPorUsuarioAsync(usuarioId, true),
            
            sprintId
              ? CicloPomodoroApi.listarPorSprintAsync(sprintId, true)
              : CicloPomodoroApi.listarPorUsuarioAsync(usuarioId, true)
          ]);
    
          return metas.map(meta => {
            const horas = ciclos
              .filter(c => c.materiaId === meta.materiaId)
              .reduce((sum, c) => sum + c.duracao, 0) / 60;
              
            return {
              ...meta,
              horasRealizadas: horas,
              progresso: meta.horasPlanejadas > 0 
                ? Math.min(100, (horas / meta.horasPlanejadas) * 100)
                : 0
            };
          });
        } catch (error) {
          console.error("Erro ao obter metas com progresso:", error);
          throw error;
        }
      }
}

export default MetaEstudoApi;