import { HTTPClient } from "./client";

const CicloPomodoroApi = {
    
    async listarAsync(ativos) {
        try {
            const response = await HTTPClient.get(`/CicloPomodoro/Listar?ativos=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Ciclo Pomodoro", error);
            throw error;
        }
    },

    async deletarAsync(cicloPomodoroId) {
        try {
            const response = await HTTPClient.delete(`/CicloPomodoro/Deletar/${cicloPomodoroId}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao deletar Ciclo Pomodoro", error);
            throw error;
        }
    },

    async adicionarAsync(usuarioId, materiaId, sprintId, tarefaId, duracao, dataRegistro) {
        try {
            const cicloPomodoroAdicionar = {                
                UsuarioId: usuarioId,
                MateriaId: materiaId,
                SprintId: sprintId,
                TarefaId: tarefaId,
                Duracao: duracao,
                DataRegistro: dataRegistro
            };
            console.log("Objeto enviado:", cicloPomodoroAdicionar);
            const response = await HTTPClient.post(`/CicloPomodoro/Adicionar`, cicloPomodoroAdicionar);
            return response.data;
        }
        catch (error) {            
            console.error("Erro ao adicionar Ciclo Pomodoro", error);
            throw error;
        }
    },

    
    async listarPorUsuarioAsync(usuarioId, ativos) {
        try {
            const response = await HTTPClient.get(`/CicloPomodoro/ListarPorUsuario/${usuarioId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Ciclo Pomodoro", error);
            throw error;
        }
    },

    async listarPorMateriaAsync(materiaId, ativos) {
        try {
            const response = await HTTPClient.get(`/CicloPomodoro/ListarPorMateria/${materiaId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Ciclo Pomodoro", error);
            throw error;
        }
    },

    async listarPorSprintAsync(sprintId, ativos) {
        try {
            const response = await HTTPClient.get(`/CicloPomodoro/ListarPorSprint/${sprintId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Ciclo Pomodoro", error);
            throw error;
        }
    },

    async listarPorTarefaAsync(tarefaId, ativos) {
        try {
            const response = await HTTPClient.get(`/CicloPomodoro/ListarPorTarefa/${tarefaId}?ativo=${ativos}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao listar Ciclo Pomodoro", error);
            throw error;
        }
    },

    async concluirCicloAsync(cicloPomodoroId, novaDuracao) {
        console.log("📡 Enviando requisição para concluir ciclo ID:", cicloPomodoroId, novaDuracao);
        try {
            const response = await HTTPClient.patch(`/CicloPomodoro/concluir/${cicloPomodoroId}/${novaDuracao}`);
            return response.data;
        }
        catch (error) {
            console.error("Erro ao concluir Ciclo Pomodoro", error);
            throw error;
        }
    },
    
    async obterHorasPorTarefaConcluidaAsync(dataInicio = null, dataFim = null) {
        try {
            let url = `/CicloPomodoro/tarefas/concluidas/horas`;
    
            const params = new URLSearchParams();
            if (dataInicio) params.append("inicio", dataInicio);
            if (dataFim) params.append("fim", dataFim);
    
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
    
            const response = await HTTPClient.get(url);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter horas por tarefa concluída", error);
            throw error;
        }
    },

    async obterHorasPorMateriaComTarefasConcluidasAsync(dataInicio = null, dataFim = null) {
        try {
            let url = `/CicloPomodoro/materias/horas`;
    
            const params = new URLSearchParams();
            if (dataInicio) params.append("inicio", dataInicio);
            if (dataFim) params.append("fim", dataFim);
    
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
    
            const response = await HTTPClient.get(url);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter horas por materia com tarefa concluída", error);
            throw error;
        }
    },

    async obterHorasPorSprintAsync(dataInicio = null, dataFim = null) {
        try {
            let url = `/CicloPomodoro/sprints/horas`;
    
            const params = new URLSearchParams();
            if (dataInicio) params.append("inicio", dataInicio);
            if (dataFim) params.append("fim", dataFim);
    
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
    
            const response = await HTTPClient.get(url);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter horas por sprint", error);
            throw error;
        }
    }    
}

export default CicloPomodoroApi;

// GET /api/ciclospomodoro/tarefas/concluidas/horas?inicio=2025-01-01&fim=2025-03-31
//await obterHorasPorTarefaConcluidaAsync();
//await obterHorasPorTarefaConcluidaAsync("2025-03-01", "2025-03-31");