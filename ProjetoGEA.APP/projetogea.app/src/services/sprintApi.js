import { HTTPClient } from "./client";

const SprintApi = {

    async obterAsync(sprintId) {
        try {
            const response = await HTTPClient.get(`/Sprint/Obter/${sprintId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter sprint", error);
            throw error;
        }
    },

    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Sprint/Listar?ativos=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar sprint", error);
            throw error;
        }
    },

    async criarAsync(nome, usuarioId, dataInicio, dataFim) {
        try {
            const sprintCriar = {
                Nome: nome,                
                UsuarioId: usuarioId,
                DataInicio: dataInicio,
                DataFim: dataFim
            };
            console.log("Objeto enviado:", sprintCriar);
            const response = await HTTPClient.post(`/Sprint/Criar`, sprintCriar);
            return response.data;
        }
        catch (error) {            
            console.error("Erro ao criar sprint", error);
            throw error;
        }
    },

    async atualizarAsync(id, nome, usuarioId, dataInicio, dataFim ) {
        try {
            const sprintAtualizar = {
                Id: id,
                Nome: nome,                
                UsuarioId: usuarioId,
                DataInicio: dataInicio,
                DataFim: dataFim
            };
            //console.log("Objeto enviado:", sprintAtualizar);
            const response = await HTTPClient.put(`/Sprint/Atualizar`, sprintAtualizar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao atualizar simulado", error);
            throw error;
        }
    },

    async deletarAsync(sprintId) {
        try {
            const response = await HTTPClient.delete(`/Sprint/Deletar/${sprintId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao deletar sprint", error);
            throw error;
        }
    },

    async listarPorUsuarioAsync(usuarioId, ativos) {
        try {
            const response = await HTTPClient.get(`/Sprint/ListarPorUsuario/${usuarioId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar sprint", error);
            throw error;
        }
    },
    
    async restaurarAsync(sprintId) {
        try {
            const response = await HTTPClient.put(`/Sprint/Restaurar/${sprintId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao restaurar sprint", error);
            throw error;
        }
    }
}

export default SprintApi;