namespace ProjetoGEA.Dominio.Entidades
{
    public class MetaEstudo
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int SprintId { get; set; }
        public int MateriaId { get; set; }
        //public int TarefaId { get; set; }
        public int HorasPlanejadas { get; set; }
        public bool Ativo { get; set; }  

        // Relacionamentos
        public Usuario Usuario { get; set; }
        public Materia Materia { get; set; }
        public Sprint Sprint { get; set; }
        //public Tarefa Tarefa { get; set; }

        public MetaEstudo(int usuarioId, int sprintId, int materiaId, int horasPlanejadas)
        {
            UsuarioId = usuarioId;
            SprintId = sprintId;
            MateriaId = materiaId;
            //TarefaId = tarefaId;
            HorasPlanejadas = horasPlanejadas;            
            Ativo = true;
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
