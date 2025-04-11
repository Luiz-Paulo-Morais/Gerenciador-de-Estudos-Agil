namespace ProjetoGEA.Api.Models.CiclosPomodoro.Requisicao
{
    public class CicloPomodoroAdicionar
    {
        public int UsuarioId { get; set; }        
        public int MateriaId { get; set; }        
        public int SprintId { get; set; }        
        public int? TarefaId { get; set; }        
        public int Duracao { get; set; } // Tempo em minutos
        public DateTime DataRegistro { get; set; }
    }
}
