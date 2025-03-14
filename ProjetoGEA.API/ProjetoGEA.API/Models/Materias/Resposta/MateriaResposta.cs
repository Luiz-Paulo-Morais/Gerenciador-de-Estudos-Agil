using ProjetoGEA.Dominio.Entidades;
namespace ProjetoGEA.Api.Models.Materias.Resposta
{
    public class MateriaResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public int UsuarioId { get; set; }

        public MateriaResposta(Materia materia)
        {
            Id = materia.Id;
            Nome = materia.Nome;
            Descricao = materia.Descricao;
            UsuarioId = materia.UsuarioId;
        }        
    }
}
