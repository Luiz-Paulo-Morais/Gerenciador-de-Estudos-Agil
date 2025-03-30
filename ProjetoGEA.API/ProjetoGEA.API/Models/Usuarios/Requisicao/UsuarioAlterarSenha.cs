namespace ProjetoGEA.Api.Models.Usuarios.Requisicao
{
    public class UsuarioAlterarSenha
    {
        public int UserId { get; set; }
        public string SenhaAtual { get; set; }
        public string NovaSenha { get; set; }        
    }
}