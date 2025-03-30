using ProjetoGEA.Dominio.Enumeradores;
using ProjetoGEA.Dominio.Entidades;
namespace ProjetoGEA.Api.Models.Usuarios.Resposta
{
    public class UsuarioResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public TiposUsuario TipoUsuario { get; set; }
        public DateTime DataCriacao { get; set; } 

        public UsuarioResposta(Usuario usuario)
        {
            Id = usuario.Id;
            Nome = usuario.Nome;
            Email = usuario.Email;
            TipoUsuario = usuario.TipoUsuario;
            DataCriacao = usuario.DataCriacao;
        }
    }
}
