using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Dominio.Enumeradores;
namespace ProjetoGEA.Api.Models.Tarefas.Resposta
{
    public class TarefaResposta
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime DataCriacao { get; set; }
        public StatusTarefa Status { get; set; }
        public int MateriaId { get; set; }        
        public string NomeMateria { get; set; }        
        public int SprintId { get; set; }        
        public string NomeSprint { get; set; }        


        public TarefaResposta(Tarefa tarefa)
        {
            Id = tarefa.Id;
            Titulo = tarefa.Titulo;
            Descricao = tarefa.Descricao;
            DataCriacao = tarefa.DataCriacao;
            Status = tarefa.Status;
            MateriaId = tarefa.MateriaId;            
            NomeMateria = tarefa.Materia?.Nome;
            SprintId = tarefa.SprintId;            
            NomeSprint = tarefa.Sprint?.Nome;            
        }
    }
}
