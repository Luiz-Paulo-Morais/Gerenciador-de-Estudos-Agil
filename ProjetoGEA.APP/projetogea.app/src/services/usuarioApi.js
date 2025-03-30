import { HTTPClient } from "./client";

const UsuarioApi = {   
    
    async obterAsync(usuarioId) {
        try {
            const response = await HTTPClient.get(`/Usuario/Obter/${usuarioId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao obter usuário", error);
            throw error;
        }
    },
    
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/Usuario/Listar?ativos=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar usuário", error);
            throw error;
        }
    },
    
    async criarAsync(nome, email, senha) {
        try {
            const usuarioCriar = {                
                Nome: nome,
                Email: email,
                Senha: senha
            };                      
            const response = await HTTPClient.post(`/Usuario/Criar`, usuarioCriar);
            return response.data;
        }
        catch (error) {
            console.log({ nome, email, senha });
            console.error("Erro ao criar usuário", error);
            throw error;
        }
    },
    
    async atualizarAsync(id, nome, email, tipoUsuario) {
        try {
            const usuarioAtualizar = {                
                Id: id,
                Nome: nome,
                Email: email,                
                TipoUsuario: tipoUsuario                
            };
            const response = await HTTPClient.put(`/Usuario/Atualizar`, usuarioAtualizar);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao atualizar usuário", error);
            throw error;
        }
    },
    
    async deletarAsync(usuarioId) {
        try {
            const response = await HTTPClient.delete(`/Usuario/Deletar/${usuarioId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao deletar usuário", error);
            throw error;
        }
    },
   
    async listarTiposUsuarioAsync() {
        try {
            const response = await HTTPClient.get(`/Usuario/ListarTiposUsuario`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar tipos de usuário", error);
            throw error;
        }
    },
    
    async alterarSenhaAsync(id, senhaAtual, novaSenha) {
        try {
            const usuarioAlterarSenha = {
                UserId: id,
                SenhaAtual:  senhaAtual,
                NovaSenha: novaSenha
            };
            const response = await HTTPClient.post(`/Usuario/AlterarSenha`, usuarioAlterarSenha);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao alterar senha do usuário", error);
            throw error;
        }
    },
    async restaurarAsync(usuarioId) {
        try {
            const response = await HTTPClient.put(`/Usuario/Restaurar/${usuarioId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao restaurar usuário", error);
            throw error;
        }
    }

}

export default UsuarioApi;