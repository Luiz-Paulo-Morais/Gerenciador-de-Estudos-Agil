namespace ProjetoGEA.Dominio.Entidades
{
    public class CicloPomodoro
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int MateriaId { get; set; }
        public int SprintId { get; set; }
        public int? TarefaId { get; set; }
        public int Duracao { get; set; } // Tempo em minutos
        public DateTime DataRegistro { get; set; } = DateTime.Now;
        public DateTime? FinalizadoEm { get; set; }
        public bool Ativo { get; set; }

        // Relacionamentos
        public Usuario Usuario { get; set; }
        public Materia Materia { get; set; }
        public Sprint Sprint { get; set; }
        public Tarefa Tarefa { get; set; }

        public CicloPomodoro(int usuarioId, int materiaId, int sprintId, int? tarefaId, int duracao, DateTime dataRegistro)
        {
            UsuarioId = usuarioId;
            MateriaId = materiaId;
            SprintId = sprintId;
            TarefaId = tarefaId;
            Duracao = duracao;
            DataRegistro = dataRegistro;
            FinalizadoEm = dataRegistro.AddMinutes(duracao); // Inicializa com base na duração
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
