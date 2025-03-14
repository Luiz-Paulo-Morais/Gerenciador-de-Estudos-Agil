namespace ProjetoGEA.Api.Models.Tarefas.Requisicao
{
    public class TarefaCriar
    {
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public int MateriaId { get; set; }
        public int SprintId { get; set; }
    }
}
