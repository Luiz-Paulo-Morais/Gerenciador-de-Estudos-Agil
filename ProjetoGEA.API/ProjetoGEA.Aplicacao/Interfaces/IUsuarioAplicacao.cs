using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Aplicacao
{
    public interface IUsuarioAplicacao
    {
        Task<int> CriarAsync(Usuario usuarioDTO);

        //Task AlterarSenhaAsync(Usuario usuarioDTO, string novaSenha);

        Task AtualizarAsync(Usuario usuarioDTO);

        Task DeletarAsync(int usuarioId);

        Task RestaurarAsync(int usuarioId);

        Task<Usuario> ObterPorIdAsync(int usuarioId);
        
        Task<Usuario> ObterPorEmailAsync(string email);

        Task<int> ObterIdPorNomeAsync(string nome);      

        Task<IEnumerable<Usuario>> ListarAsync(bool ativo);
    }
}