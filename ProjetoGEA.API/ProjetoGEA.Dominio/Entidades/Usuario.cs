using Microsoft.AspNetCore.Identity;
using ProjetoGEA.Dominio.Enumeradores;

namespace ProjetoGEA.Dominio.Entidades
{
    public class Usuario : IdentityUser<int>
    {
        public string Nome { get; set; }        
        public TiposUsuario TipoUsuario { get; set; }        
        public DateTime DataCriacao { get; set; }        
        public bool Ativo { get; set; }

        // Relacionamentos
        public ICollection<Materia> Materias { get; set; }
        public ICollection<Sprint> Sprints { get; set; }
        public ICollection<Simulado> Simulados { get; set; }
        public ICollection<CicloPomodoro> CiclosPomodoro { get; set; }
        public ICollection<MetaEstudo> MetasEstudo { get; set; }

        public Usuario()
        {
            Ativo = true;
            DataCriacao = DateTime.UtcNow;            
            TipoUsuario = TiposUsuario.Default; // 🆕 Define um tipo padrão

            Materias = new List<Materia>();
            Sprints = new List<Sprint>();
            Simulados = new List<Simulado>();
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
