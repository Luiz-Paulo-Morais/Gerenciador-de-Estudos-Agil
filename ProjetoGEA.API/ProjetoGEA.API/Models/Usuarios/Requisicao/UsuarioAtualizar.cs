using ProjetoGEA.Dominio.Enumeradores;
namespace ProjetoGEA.Api.Models.Usuarios.Requisicao
{
    public class UsuarioAtualizar
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public TiposUsuario TipoUsuario { get; set; }         
    }
}