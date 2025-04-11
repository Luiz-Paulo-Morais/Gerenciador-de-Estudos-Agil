using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Aplicacao
{
    public interface ITarefaAplicacao
    {
        Task<int> CriarAsync(Tarefa tarefaDTO);
        Task AtualizarAsync(Tarefa tarefaDTO);
        Task DeletarAsync(int tarefaId);
        Task RestaurarAsync(int tarefaId);
        Task<Tarefa> ObterPorIdAsync(int tarefaId);
        Task<int?> ObterUsuarioIdPorTarefaAsync(int tarefaId);
        Task<IEnumerable<Tarefa>> ListarPorMateriaAsync(int materiaId, bool ativo);
        Task<IEnumerable<Tarefa>> ListarPorSprintAsync(int sprintId, bool ativo);
        Task<IEnumerable<Tarefa>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Tarefa>> ListarAsync(bool ativo);
    }
}
