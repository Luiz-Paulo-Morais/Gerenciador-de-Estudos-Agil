
namespace ProjetoGEA.Dominio.Entidades
{
    public class Sprint
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public ICollection<Tarefa> Tarefas { get; set; }        
        public ICollection<CicloPomodoro> CiclosPomodoro { get; set; }
        public ICollection<MetaEstudo> MetasEstudo { get; set; }
        public bool Ativo { get; set; }

        public Sprint()
        {
            Ativo = true;
            Tarefas = new List<Tarefa>();
            CiclosPomodoro = new List<CicloPomodoro>();
            MetasEstudo = new List<MetaEstudo>();            
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
