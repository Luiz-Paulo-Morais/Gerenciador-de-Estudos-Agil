import { HTTPClient } from "./client";

const SimuladoApi = {

    async obterAsync(simuladoId) {
        try {
            const response = await HTTPClient.get(`/Simulado/Obter/${simuladoId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter simulado", error);
            throw error;
        }
    },

    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Simulado/Listar?ativos=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar simulado", error);
            throw error;
        }
    },

    async criarAsync(nome, dataAplicacao, usuarioId, materiaId, totalQuestoes, totalAcertos) {
        try {
            const simuladoCriar = {
                Nome: nome,
                DataAplicacao: dataAplicacao,
                UsuarioId: usuarioId,
                MateriaId: materiaId,
                TotalQuestoes: totalQuestoes,
                TotalAcertos: totalAcertos
            };
            console.log("Objeto enviado:", simuladoCriar);
            const response = await HTTPClient.post(`/Simulado/Criar`, simuladoCriar);
            return response.data;
        }
        catch (error) {            
            console.error("Erro ao criar simulado", error);
            throw error;
        }
    },

    async atualizarAsync(id, nome, dataAplicacao, usuarioId, materiaId, totalQuestoes, totalAcertos) {
        try {
            const simuladoAtualizar = {
                Id: id,
                Nome: nome,
                DataAplicacao: dataAplicacao,
                UsuarioId: usuarioId,
                MateriaId: materiaId,
                TotalQuestoes: totalQuestoes,
                TotalAcertos: totalAcertos
            };
            //console.log("Objeto enviado:", simuladoAtualizar);
            const response = await HTTPClient.put(`/Simulado/Atualizar`, simuladoAtualizar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao atualizar simulado", error);
            throw error;
        }
    },

    async deletarAsync(simuladoId) {
        try {
            const response = await HTTPClient.delete(`/Simulado/Deletar/${simuladoId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao deletar simulado", error);
            throw error;
        }
    },

    async listarPorUsuarioAsync(usuarioId, ativos) {
        try {
            const response = await HTTPClient.get(`/Simulado/ListarPorUsuario/${usuarioId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar simulado", error);
            throw error;
        }
    },

    async listarPorMateriaAsync(materiaId, ativos) {
        try {
            const response = await HTTPClient.get(`/Simulado/ListarPorMateria/${materiaId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar simulado", error);
            throw error;
        }
    },
    
    async restaurarAsync(simuladoId) {
        try {
            const response = await HTTPClient.put(`/Simulado/Restaurar/${simuladoId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao restaurar simulado", error);
            throw error;
        }
    }
}

export default SimuladoApi;