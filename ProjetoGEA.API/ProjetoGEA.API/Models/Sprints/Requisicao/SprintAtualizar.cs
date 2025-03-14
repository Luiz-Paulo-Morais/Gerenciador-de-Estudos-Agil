namespace ProjetoGEA.Api.Models.Sprints.Requisicao
{
    public class SprintAtualizar
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public int UsuarioId { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
    }
}
