using ProjetoGEA.Dominio.Enumeradores;
namespace ProjetoGEA.Api.Models.Usuarios.Resposta
{
    public class TipoUsuarioResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public TiposUsuario TipoUsuario { get; set; }            
    }
}
