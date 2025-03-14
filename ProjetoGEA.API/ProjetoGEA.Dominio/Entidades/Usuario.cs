using Microsoft.AspNetCore.Identity;

namespace ProjetoGEA.Dominio.Entidades
{
    public class Usuario : IdentityUser<int>
    {
        public string Nome { get; set; }
        public string SenhaHash { get; set; }        
        public DateTime DataCriacao { get; set; }        
        public bool Ativo { get; set; }

        // Relacionamentos
        public ICollection<Materia> Materias { get; set; }
        public ICollection<Sprint> Sprints { get; set; }
        public ICollection<Simulado> Simulados { get; set; }

        public Usuario()
        {
            Ativo = true;
            DataCriacao = DateTime.UtcNow;
            SenhaHash = "111";

            Materias = new List<Materia>();
            Sprints = new List<Sprint>();
            Simulados = new List<Simulado>();
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
