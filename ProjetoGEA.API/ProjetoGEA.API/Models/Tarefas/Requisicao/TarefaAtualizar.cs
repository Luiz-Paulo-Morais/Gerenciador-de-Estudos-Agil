namespace ProjetoGEA.Api.Models.Tarefas.Requisicao
{
    public class TarefaAtualizar
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }        
        public int MateriaId { get; set; }
        public int SprintId { get; set; }
        public bool Concluida { get; set; }
    }
}
