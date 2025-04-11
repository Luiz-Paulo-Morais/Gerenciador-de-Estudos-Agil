using ProjetoGEA.Dominio.Enumeradores;
namespace ProjetoGEA.Api.Models.Tarefas.Resposta
{
    public class StatusTarefaResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public StatusTarefa StatusTarefa { get; set; }            
    }
}
