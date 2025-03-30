import { HTTPClient } from "./client";

const MateriaApi = {

    async obterAsync(materiaId) {
        try {
            const response = await HTTPClient.get(`/Materia/Obter/${materiaId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter matéria", error);
            throw error;
        }
    },

    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Materia/Listar?ativos=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar matéria", error);
            throw error;
        }
    },

    async criarAsync(nome, descricao, usuarioId) {
        try {
            const materiaCriar = {
                Nome: nome,
                Descricao: descricao,
                UsuarioId: usuarioId
            };
            const response = await HTTPClient.post(`/Materia/Criar`, materiaCriar);
            return response.data;
        }
        catch (error) {            
            console.error("Erro ao criar matéria", error);
            throw error;
        }
    },

    async atualizarAsync(id, nome, descricao, usuarioId) {
        try {
            const materiaAtualizar = {
                Id: id,
                Nome: nome,
                Descricao: descricao,
                UsuarioId: usuarioId
            };
            //console.log("Objeto enviado:", materiaAtualizar);
            const response = await HTTPClient.put(`/Materia/Atualizar`, materiaAtualizar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao atualizar matéria", error);
            throw error;
        }
    },

    async deletarAsync(materiaId) {
        try {
            const response = await HTTPClient.delete(`/Materia/Deletar/${materiaId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao deletar matéria", error);
            throw error;
        }
    },

    async listarPorUsuarioAsync(materiaId, ativos) {
        try {
            const response = await HTTPClient.get(`/Materia/ListarPorUsuario/${materiaId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar matéria", error);
            throw error;
        }
    },
    
    async restaurarAsync(materiaId) {
        try {
            const response = await HTTPClient.put(`/Materia/Restaurar/${materiaId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao restaurar matéria", error);
            throw error;
        }
    }
}

export default MateriaApi;