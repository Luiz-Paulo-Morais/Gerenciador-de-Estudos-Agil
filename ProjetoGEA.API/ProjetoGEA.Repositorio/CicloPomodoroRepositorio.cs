using Microsoft.EntityFrameworkCore;
using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Dominio.Enumeradores;

namespace ProjetoGEA.Repositorio
{
    public class CicloPomodoroRepositorio : BaseRepositorio, ICicloPomodoroRepositorio
    {
        public CicloPomodoroRepositorio(ProjetoGEAContexto contexto)
            : base(contexto) { }

        public async Task<int> AdicionarAsync(CicloPomodoro ciclo)
        {
            _contexto.CiclosPomodoro.Add(ciclo);
            await _contexto.SaveChangesAsync();
            return ciclo.Id;
        }

        private IQueryable<CicloPomodoro> IncluirRelacionamentos(IQueryable<CicloPomodoro> query)
        {
            return query.Include(c => c.Tarefa).Include(c => c.Materia).Include(c => c.Sprint);
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorUsuarioAsync(
            int usuarioId,
            bool ativo
        )
        {
            var query = _contexto.CiclosPomodoro.Where(c =>
                c.UsuarioId == usuarioId && c.Ativo == ativo
            );

            return await IncluirRelacionamentos(query).ToListAsync();
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorMateriaAsync(
            int materiaId,
            bool ativo
        )
        {
            var query = _contexto.CiclosPomodoro.Where(c =>
                c.MateriaId == materiaId && c.Ativo == ativo
            );

            return await IncluirRelacionamentos(query).ToListAsync();
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorSprintAsync(int sprintId, bool ativo)
        {
            var query = _contexto.CiclosPomodoro.Where(c =>
                c.SprintId == sprintId && c.Ativo == ativo
            );

            return await IncluirRelacionamentos(query).ToListAsync();
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarPorTarefaAsync(int tarefaId, bool ativo)
        {
            var query = _contexto.CiclosPomodoro.Where(c =>
                c.TarefaId == tarefaId && c.Ativo == ativo
            );

            return await IncluirRelacionamentos(query).ToListAsync();
        }

        public async Task<IEnumerable<CicloPomodoro>> ListarAsync(bool ativo)
        {
            var query = _contexto.CiclosPomodoro.Where(c => c.Ativo == ativo);

            return await IncluirRelacionamentos(query).ToListAsync();
        }

        public async Task<CicloPomodoro> ObterDesativoAsync(int cicloPomodoroId)
        {
            return await _contexto
                .CiclosPomodoro.Where(c => c.Id == cicloPomodoroId && !c.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<CicloPomodoro> ObterPorIdAsync(int cicloPomodoroId)
        {
            return await _contexto
                .CiclosPomodoro.Where(c => c.Id == cicloPomodoroId && c.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task AtualizarAsync(CicloPomodoro cicloPomodoro)
        {
            _contexto.CiclosPomodoro.Update(cicloPomodoro);
            await _contexto.SaveChangesAsync();
        }

        // Obter total de horas por tarefa
        public async Task<
            Dictionary<int, Dictionary<int?, double>>
        > ObterHorasPorTarefaConcluidaAsync(DateTime? inicio = null, DateTime? fim = null)
        {
            var query = _contexto.CiclosPomodoro.Where(c =>
                c.Ativo && c.Tarefa.Status == StatusTarefa.Concluida
            );

            if (inicio.HasValue)
                query = query.Where(c => c.FinalizadoEm >= inicio.Value);

            if (fim.HasValue)
                query = query.Where(c => c.FinalizadoEm <= fim.Value);

            return await query
                .GroupBy(c => new { c.TarefaId, c.MateriaId })
                .Select(g => new
                {
                    TarefaId = g.Key.TarefaId,
                    MateriaId = g.Key.MateriaId,
                    TotalHoras = g.Sum(x => x.Duracao) / 60.0,
                })
                .ToListAsync()
                .ContinueWith(task =>
                    task.Result.GroupBy(g => g.MateriaId)
                        .ToDictionary(
                            materiaGroup => materiaGroup.Key,
                            materiaGroup =>
                                materiaGroup.ToDictionary(
                                    tarefa => tarefa.TarefaId,
                                    tarefa => tarefa.TotalHoras
                                )
                        )
                );
        }

        // Total de horas por matéria e sprint (somente tarefas concluídas)
        public async Task<Dictionary<int, double>> ObterHorasPorMateriaComTarefasConcluidasAsync(
            DateTime? inicio = null,
            DateTime? fim = null
        )
        {
            var query = _contexto.CiclosPomodoro.Where(c =>
                c.Ativo && c.Tarefa.Status == StatusTarefa.Concluida
            );

            if (inicio.HasValue)
                query = query.Where(c => c.FinalizadoEm >= inicio.Value);

            if (fim.HasValue)
                query = query.Where(c => c.FinalizadoEm <= fim.Value);

            return await query
                .GroupBy(c => c.MateriaId)
                .Select(g => new { MateriaId = g.Key, TotalHoras = g.Sum(x => x.Duracao) / 60.0 })
                .ToDictionaryAsync(g => g.MateriaId, g => g.TotalHoras);
        }

        // Total de horas por sprint e matéria (independe de status da tarefa)
        public async Task<Dictionary<int, double>> ObterHorasPorSprintAsync(
            DateTime? inicio = null,
            DateTime? fim = null
        )
        {
            var query = _contexto.CiclosPomodoro.Where(c => c.Ativo);

            if (inicio.HasValue)
                query = query.Where(c => c.FinalizadoEm >= inicio.Value);

            if (fim.HasValue)
                query = query.Where(c => c.FinalizadoEm <= fim.Value);

            return await query
                .GroupBy(c => c.SprintId)
                .Select(g => new { SprintId = g.Key, TotalHoras = g.Sum(x => x.Duracao) / 60.0 })
                .ToDictionaryAsync(g => g.SprintId, g => g.TotalHoras);
        }

        public async Task ConcluirCicloAsync(int cicloPomodoroId, int novaDuracao)
        {
            var ciclo = await _contexto.CiclosPomodoro.FindAsync(cicloPomodoroId);
            if (ciclo == null || !ciclo.Ativo)
                throw new Exception("Ciclo não encontrado ou já inativo.");

            ciclo.Duracao = novaDuracao;
            ciclo.FinalizadoEm = DateTime.UtcNow;
            await _contexto.SaveChangesAsync();
        }
    }
}
