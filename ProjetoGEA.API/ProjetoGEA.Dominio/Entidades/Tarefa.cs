
namespace ProjetoGEA.Dominio.Entidades
{
    public class Tarefa
    {
        public int Id { get; set; }
        public string Titulo { get; set; }
        public string Descricao { get; set; }
        public DateTime DataCriacao { get; set; }
        public bool Concluida { get; set; }
        public int MateriaId { get; set; }
        public Materia Materia { get; set; }
        public int SprintId { get; set; }
        public Sprint Sprint { get; set; }      
        public bool Ativo { get; set; }
        
        public Tarefa()
        {
            Ativo = true;
            DataCriacao = DateTime.UtcNow;
            Concluida = false;
        }

        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
        }
        public void Concluir()
        {
            Concluida = true;
        }

        public void RestaurarConcluir()
        {
            Concluida = false;
        }
    }
}
