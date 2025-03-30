using ProjetoGEA.Dominio.Enumeradores;
namespace ProjetoGEA.Api.Models
{
    public class RegisterRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Nome { get; set; } 
        public TiposUsuario TipoUsuario { get; set; }     

    }
}