namespace ProjetoGEA.Api.Models.MetasEstudo.Requisicao
{
    public class MetaEstudoAtualizar
    {        
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int SprintId { get; set; }
        public int MateriaId { get; set; }
        //public int TarefaId { get; set; }
        public int HorasPlanejadas { get; set; }
    }
}
