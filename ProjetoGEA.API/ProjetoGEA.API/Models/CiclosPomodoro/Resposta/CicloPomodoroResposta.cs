using ProjetoGEA.Dominio.Entidades;
namespace ProjetoGEA.Api.Models.CiclosPomodoro.Resposta
{
    public class CicloPomodoroResposta
    {
        public int Id { get; set; }
        public string TituloTarefa { get; set; }
        public string NomeMateria { get; set; }
        public string NomeSprint { get; set; }
        public int UsuarioId { get; set; }        
        public int MateriaId { get; set; }        
        public int SprintId { get; set; }        
        public int? TarefaId { get; set; }        
        public int Duracao { get; set; } // Tempo em minutos
        public DateTime DataRegistro { get; set; }

        public CicloPomodoroResposta(CicloPomodoro cicloPomodoro)
        {
            Id = cicloPomodoro.Id;
            UsuarioId = cicloPomodoro.UsuarioId;
            MateriaId = cicloPomodoro.MateriaId;
            SprintId = cicloPomodoro.SprintId;
            TarefaId = cicloPomodoro.TarefaId;
            Duracao = cicloPomodoro.Duracao;
            DataRegistro = cicloPomodoro.DataRegistro;  
            TituloTarefa = cicloPomodoro.Tarefa?.Titulo;          
            NomeMateria = cicloPomodoro.Materia?.Nome;          
            NomeSprint = cicloPomodoro.Sprint?.Nome;          
        }
    }
}
