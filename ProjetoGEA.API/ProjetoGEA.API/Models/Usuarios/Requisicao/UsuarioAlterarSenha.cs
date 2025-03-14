namespace ProjetoGEA.Api.Models.Usuarios.Requisicao
{
    public class UsuarioAlterarSenha
    {
        public int Id { get; set; }
        public string SenhaAntiga { get; set; }
        public string NovaSenha { get; set; }        
    }
}