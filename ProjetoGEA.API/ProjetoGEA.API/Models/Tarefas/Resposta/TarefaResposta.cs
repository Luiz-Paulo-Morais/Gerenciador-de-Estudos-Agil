using ProjetoGEA.Dominio.Entidades;
namespace ProjetoGEA.Api.Models.Tarefas.Resposta
{
    public class TarefaResposta
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime DataCriacao { get; set; }
        public bool Concluida { get; set; }
        public int MateriaId { get; set; }
        public int SprintId { get; set; }


        public TarefaResposta(Tarefa tarefa)
        {
            Id = tarefa.Id;
            Titulo = tarefa.Titulo;
            Descricao = tarefa.Descricao;
            DataCriacao = tarefa.DataCriacao;
            Concluida = tarefa.Concluida;
            MateriaId = tarefa.MateriaId;
            SprintId = tarefa.SprintId;
        }
    }
}
