using Microsoft.EntityFrameworkCore;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public class SprintRepositorio : BaseRepositorio, ISprintRepositorio
    {
        public SprintRepositorio(ProjetoGEAContexto contexto) : base(contexto)
        {
        }

        public async Task<int> CriarAsync(Sprint sprint)
        {
            _contexto.Sprints.Add(sprint);
            await _contexto.SaveChangesAsync();
            return sprint.Id;
        }

        public async Task AtualizarAsync(Sprint sprint)
        {
            _contexto.Sprints.Update(sprint);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Sprint> ObterPorIdAsync(int sprintId)
        {
            return await _contexto.Sprints
                .Where(s => s.Id == sprintId && s.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<Sprint> ObterDesativoAsync(int sprintId)
        {
            return await _contexto.Sprints
                .Where(s => s.Id == sprintId && !s.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Sprint>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _contexto.Sprints
                .Where(s => s.UsuarioId == usuarioId && s.Ativo == ativo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Sprint>> ListarAsync(bool ativo)
        {
            return await _contexto.Sprints
                .Where(s => s.Ativo == ativo)
                .ToListAsync();
        }
    }
}
