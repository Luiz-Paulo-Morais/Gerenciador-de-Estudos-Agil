using ProjetoGEA.Dominio.Enumeradores;
namespace ProjetoGEA.Dominio.Entidades
{
    public class Tarefa
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime DataCriacao { get; set; }
        public StatusTarefa Status { get; set; }
        public int MateriaId { get; set; }
        public Materia Materia { get; set; }
        public int SprintId { get; set; }
        public Sprint Sprint { get; set; }
            
        public bool Ativo { get; set; }
        public ICollection<CicloPomodoro> CiclosPomodoro { get; set; }
        //public ICollection<MetaEstudo> MetasEstudo { get; set; }
        
        public Tarefa()
        {
            Ativo = true;
            DataCriacao = DateTime.UtcNow;
            Status = StatusTarefa.Pendente; // Inicializa com o status Pendente
            CiclosPomodoro = new List<CicloPomodoro>();
            //MetasEstudo = new List<MetaEstudo>();
        }

        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
        }       
    }
}
