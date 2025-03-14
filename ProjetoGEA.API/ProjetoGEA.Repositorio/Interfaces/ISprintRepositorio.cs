using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public interface ISprintRepositorio
    {
        Task<int> CriarAsync(Sprint sprint);
        Task AtualizarAsync(Sprint sprint);
        Task<Sprint> ObterPorIdAsync(int sprintId);
        Task<Sprint> ObterDesativoAsync(int sprintId);
        Task<IEnumerable<Sprint>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Sprint>> ListarAsync(bool ativo);
    }
}