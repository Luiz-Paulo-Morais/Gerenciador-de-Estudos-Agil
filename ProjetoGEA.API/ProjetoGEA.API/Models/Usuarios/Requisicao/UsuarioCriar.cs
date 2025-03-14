namespace ProjetoGEA.Api.Models.Usuarios.Requisicao
{
    public class UsuarioCriar
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public DateTime DataCriacao { get; set; }  
    }
}