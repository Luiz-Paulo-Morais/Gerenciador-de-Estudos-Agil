using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public interface ITarefaRepositorio
    {
        Task<int> CriarAsync(Tarefa tarefa);
        Task AtualizarAsync(Tarefa tarefa);
        Task<Tarefa> ObterPorIdAsync(int tarefaId);
        Task<int?> ObterUsuarioIdPorTarefaAsync(int tarefaId);
        Task<Tarefa> ObterDesativoAsync(int tarefaId);
        Task<IEnumerable<Tarefa>> ListarPorMateriaAsync(int materiaId, bool ativo);
        Task<IEnumerable<Tarefa>> ListarPorSprintAsync(int sprintId, bool ativo);
        Task<IEnumerable<Tarefa>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Tarefa>> ListarAsync(bool ativo);
    }
}