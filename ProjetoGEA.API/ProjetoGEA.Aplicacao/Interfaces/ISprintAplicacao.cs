using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Aplicacao
{
    public interface ISprintAplicacao
    {
        Task<int> CriarAsync(Sprint sprintDTO);
        Task AtualizarAsync(Sprint sprintDTO);
        Task DeletarAsync(int sprintId);
        Task RestaurarAsync(int sprintId);
        Task<Sprint> ObterPorIdAsync(int sprintId);
        Task<IEnumerable<Sprint>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Sprint>> ListarAsync(bool ativo);
    }
}
