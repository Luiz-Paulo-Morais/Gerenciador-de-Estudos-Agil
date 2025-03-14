using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Repositorio;

namespace ProjetoGEA.Aplicacao
{
    public class UsuarioAplicacao : IUsuarioAplicacao
    {
        readonly IUsuarioRepositorio _usuarioRepositorio;

        public UsuarioAplicacao(IUsuarioRepositorio usuarioRepositorio)
        {
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task<int> CriarAsync(Usuario usuario)
        {
            if (usuario == null)
            {
                throw new Exception("Usuario nao pode ser vazio");
            }

            await ValidarInformacoesUsuarioAsync(usuario);
            if (string.IsNullOrEmpty(usuario.SenhaHash))
            {
                throw new Exception("Senha nao pode ser vazio");
            }

            return await _usuarioRepositorio.CriarAsync(usuario);
        }


        public async Task AtualizarAsync(Usuario usuario)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorIdAsync(usuario.Id);

            if (usuarioDominio == null)
            {
                throw new Exception("Usuario nao pode ser vazio");
            }

            await ValidarInformacoesUsuarioAsync(usuario);

            usuarioDominio.Nome = usuario.Nome;
            usuarioDominio.Email = usuario.Email;
            usuarioDominio.DataCriacao = usuario.DataCriacao;        

            await _usuarioRepositorio.AtualizarAsync(usuarioDominio);
        }

        public async Task AlterarSenhaAsync(Usuario usuario, string senhaAntiga)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorIdAsync(usuario.Id);

            if (usuarioDominio == null)
            {
                throw new Exception("Usuario nao encontrado");
            }
            if (usuarioDominio.SenhaHash != senhaAntiga)
            {
                throw new Exception("Senha antiga invalida");
            }

            usuarioDominio.SenhaHash = usuario.SenhaHash;

            await _usuarioRepositorio.AtualizarAsync(usuarioDominio);
        }

        public async Task<Usuario> ObterPorIdAsync(int usuarioId)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorIdAsync(usuarioId);

            if (usuarioDominio == null)
            {
                throw new Exception("Usuario nao encontrado");
            }

            return usuarioDominio;
        }
        public async Task<Usuario> ObterPorEmailAsync(string email)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorEmailAsync(email);

            if (usuarioDominio == null)
            {
                throw new Exception("Usuario nao encontrado");
            }

            return usuarioDominio;
        }
        public async Task<int> ObterIdPorNomeAsync(string nome)
        {
            var usuarioDominioId = await _usuarioRepositorio.ObterIdPorNomeAsync(nome);

            if (usuarioDominioId == 0)
            {
                throw new Exception("Usuario nao encontrado");
            }

            return usuarioDominioId;
        }
        public async Task DeletarAsync(int usuarioId)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterPorIdAsync(usuarioId);

            if (usuarioDominio == null)
            {
                throw new Exception("Usuario nao encontrado");
            }

            usuarioDominio.Deletar();

            await _usuarioRepositorio.AtualizarAsync(usuarioDominio);

        }
        public async Task RestaurarAsync(int usuarioId)
        {
            var usuarioDominio = await _usuarioRepositorio.ObterDesativoAsync(usuarioId);

            if (usuarioDominio == null)
            {
                throw new Exception("Usuario nao encontrado");
            }

            usuarioDominio.Restaurar();

            await _usuarioRepositorio.AtualizarAsync(usuarioDominio);
        }

        public async Task<IEnumerable<Usuario>> ListarAsync(bool ativo)
        {
            return await _usuarioRepositorio.ListarAsync(ativo);
        }

        
        #region Util
        private static async Task ValidarInformacoesUsuarioAsync(Usuario usuario)
        {
            if (string.IsNullOrEmpty(usuario.Nome))
            {
                throw new Exception("Nome nao pode ser vazio");
            }
            if (string.IsNullOrEmpty(usuario.Email))
            {
                throw new Exception("Email nao pode ser vazio");
            }
        }
        #endregion
    }
}