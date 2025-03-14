using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Api.Models.Sprints.Resposta
{
    public class SprintResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int UsuarioId { get; set; }

        public SprintResposta(Sprint sprint)
        {
            Id = sprint.Id;
            Nome = sprint.Nome;
            DataInicio = sprint.DataInicio;
            DataFim = sprint.DataFim;
            UsuarioId = sprint.UsuarioId;
        }
    }
}
