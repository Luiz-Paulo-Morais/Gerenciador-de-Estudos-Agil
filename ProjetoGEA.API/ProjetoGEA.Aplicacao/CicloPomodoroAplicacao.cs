using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Repositorio;

namespace ProjetoGEA.Aplicacao
{
    public class CicloPomodoroAplicacao : ICicloPomodoroAplicacao
    {
        private readonly ICicloPomodoroRepositorio _cicloPomodoroRepositorio;

        public CicloPomodoroAplicacao(ICicloPomodoroRepositorio cicloPomodoroRepositorio)
        {
            _cicloPomodoroRepositorio = cicloPomodoroRepositorio;
        }

        public async Task<int> AdicionarAsync(CicloPomodoro ciclo)
        {
            if (ciclo == null)
            {
                throw new Exception("Ciclo Pomodoro não pode ser vazio");
            }

            return await _cicloPomodoroRepositorio.AdicionarAsync(ciclo);
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _cicloPomodoroRepositorio.ListarPorUsuarioAsync(usuarioId, ativo);
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorMateriaAsync(int materiaId, bool ativo)
        {
            return await _cicloPomodoroRepositorio.ListarPorMateriaAsync(materiaId, ativo);
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorSprintAsync(int sprintId, bool ativo)
        {
            return await _cicloPomodoroRepositorio.ListarPorSprintAsync(sprintId, ativo);
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorTarefaAsync(int tarefaId, bool ativo)
        {
            return await _cicloPomodoroRepositorio.ListarPorTarefaAsync(tarefaId, ativo);
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarAsync(bool ativo)
        {
            return await _cicloPomodoroRepositorio.ListarAsync(ativo);
        }

        public async Task<CicloPomodoro> ObterPorIdAsync(int cicloPomodoroId)
        {
            return await _cicloPomodoroRepositorio.ObterPorIdAsync(cicloPomodoroId)
                ?? throw new Exception("Ciclo Pomodoro não encontrado");
        }


        public async Task DeletarAsync(int cicloPomodoroId)
        {
            var cicloPomodoroDominio = await _cicloPomodoroRepositorio.ObterPorIdAsync(cicloPomodoroId);
            if (cicloPomodoroDominio == null)
            {
                throw new Exception("Ciclo Pomodoro não encontrado");
            }

            cicloPomodoroDominio.Deletar();
            await _cicloPomodoroRepositorio.AtualizarAsync(cicloPomodoroDominio);
        }

        public async Task<Dictionary<int, Dictionary<int?, double>>> ObterHorasPorTarefaConcluidaAsync(DateTime? inicio, DateTime? fim)
        {
            return await _cicloPomodoroRepositorio.ObterHorasPorTarefaConcluidaAsync(inicio, fim);
        }
        public async Task<Dictionary<int, double>> ObterHorasPorMateriaComTarefasConcluidasAsync(DateTime? inicio, DateTime? fim)
        {
            return await _cicloPomodoroRepositorio.ObterHorasPorMateriaComTarefasConcluidasAsync(inicio, fim);
        }
        public async Task<Dictionary<int, double>> ObterHorasPorSprintAsync(DateTime? inicio, DateTime? fim)
        {
            return await _cicloPomodoroRepositorio.ObterHorasPorSprintAsync(inicio, fim);
        }

        public async Task ConcluirCicloAsync(int cicloPomodoroId, int novaDuracao)
        {
            await _cicloPomodoroRepositorio.ConcluirCicloAsync(cicloPomodoroId, novaDuracao);
        }

    }
}
