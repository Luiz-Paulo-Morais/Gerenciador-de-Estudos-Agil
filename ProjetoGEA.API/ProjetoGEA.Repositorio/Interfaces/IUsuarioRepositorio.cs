using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public interface IUsuarioRepositorio
    {
        Task<int> CriarAsync(Usuario usuario);
        Task AtualizarAsync(Usuario usuario);
        Task<Usuario> ObterPorIdAsync(int usuarioId);
        Task<Usuario> ObterDesativoAsync(int usuarioId);
        Task<Usuario> ObterPorEmailAsync(string email);
        Task<int> ObterIdPorNomeAsync(string nome);
        Task<IEnumerable<Usuario>> ListarAsync(bool ativo);
    }
}