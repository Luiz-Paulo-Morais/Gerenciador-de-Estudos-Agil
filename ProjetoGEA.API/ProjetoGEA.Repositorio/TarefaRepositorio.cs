using Microsoft.EntityFrameworkCore;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public class TarefaRepositorio : BaseRepositorio, ITarefaRepositorio
    {
        public TarefaRepositorio(ProjetoGEAContexto contexto) : base(contexto)
        {
        }

        public async Task<int> CriarAsync(Tarefa tarefa)
        {
            _contexto.Tarefas.Add(tarefa);
            await _contexto.SaveChangesAsync();
            return tarefa.Id;
        }

        public async Task AtualizarAsync(Tarefa tarefa)
        {
            _contexto.Tarefas.Update(tarefa);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Tarefa> ObterPorIdAsync(int tarefaId)
        {
            return await _contexto.Tarefas
                .Where(t => t.Id == tarefaId)
                .FirstOrDefaultAsync();
        }

        public async Task<Tarefa> ObterDesativoAsync(int tarefaId)
        {
            return await _contexto.Tarefas
                .Where(t => t.Id == tarefaId && !t.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Tarefa>> ListarPorMateriaAsync(int materiaId, bool ativo)
        {
            return await _contexto.Tarefas
                .Where(t => t.MateriaId == materiaId && t.Ativo == ativo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Tarefa>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _contexto.Tarefas
                .Where(t => t.Materia.UsuarioId == usuarioId && t.Ativo == ativo)
                .Include(t => t.Materia) // Incluindo a relação com Materia
                .ToListAsync();
        }

        public async Task<IEnumerable<Tarefa>> ListarAsync(bool ativo)
        {
            return await _contexto.Tarefas
                .Where(t => t.Ativo == ativo)
                .ToListAsync();
        }
    }
}
