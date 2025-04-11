using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Aplicacao
{
    public interface ICicloPomodoroAplicacao
    {
        Task<int> AdicionarAsync(CicloPomodoro ciclo);
        Task<IEnumerable<CicloPomodoro>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<CicloPomodoro>> ListarPorMateriaAsync(int materiaId, bool ativo);
        Task<IEnumerable<CicloPomodoro>> ListarPorSprintAsync(int sprintId, bool ativo);
        Task<IEnumerable<CicloPomodoro>> ListarPorTarefaAsync(int tarefaId, bool ativo);
        Task<IEnumerable<CicloPomodoro>> ListarAsync(bool ativo);
        Task DeletarAsync(int cicloPomodoroId);
        Task<CicloPomodoro> ObterPorIdAsync(int cicloPomodoroId);
        Task<Dictionary<int, Dictionary<int?, double>>> ObterHorasPorTarefaConcluidaAsync(DateTime? inicio = null, DateTime? fim = null);
        Task<Dictionary<int, double>> ObterHorasPorMateriaComTarefasConcluidasAsync(DateTime? inicio = null, DateTime? fim = null);
        Task<Dictionary<int, double>> ObterHorasPorSprintAsync(DateTime? inicio = null, DateTime? fim = null);
        Task ConcluirCicloAsync(int cicloPomodoroId, int novaDuracao);
    }
}
