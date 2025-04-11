using ProjetoGEA.Dominio.Entidades;
namespace ProjetoGEA.Api.Models.MetasEstudo.Resposta
{
    public class MetaEstudoResposta
    {
        public int Id { get; set; }
        //public string TituloTarefa { get; set; }
        public string NomeMateria { get; set; }
        public string NomeSprint { get; set; }
        public int UsuarioId { get; set; }
        public int SprintId { get; set; }
        public int MateriaId { get; set; }
        //public int TarefaId { get; set; }
        public int HorasPlanejadas { get; set; }

        public MetaEstudoResposta(MetaEstudo metaEstudo)
        {
            Id = metaEstudo.Id;
            UsuarioId = metaEstudo.UsuarioId;
            SprintId = metaEstudo.SprintId;
            MateriaId = metaEstudo.MateriaId;
            //TarefaId = metaEstudo.TarefaId;
            HorasPlanejadas = metaEstudo.HorasPlanejadas;
            //TituloTarefa = metaEstudo.Tarefa?.Titulo;
            NomeMateria = metaEstudo.Materia?.Nome;
            NomeSprint = metaEstudo.Sprint?.Nome;
        }
    }
}
