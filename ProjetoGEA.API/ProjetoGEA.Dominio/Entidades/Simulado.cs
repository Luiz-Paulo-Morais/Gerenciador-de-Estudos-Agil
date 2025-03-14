
namespace ProjetoGEA.Dominio.Entidades
{
    public class Simulado
    {
        public int Id { get; private set; }
        public string Nome { get; private set; }
        public DateTime DataAplicacao { get; private set; }
        public int UsuarioId { get; private set; }
        public Usuario Usuario { get; private set; }
        public int MateriaId { get; private set; }
        public Materia Materia { get; private set; }
        public int TotalQuestoes { get; private set; }
        public int TotalAcertos { get; private set; }
        public bool Ativo { get; private set; }

        public double PercentualAproveitamento => TotalQuestoes > 0 ? (double)TotalAcertos / TotalQuestoes * 100 : 0;

        public Simulado(string nome, DateTime dataAplicacao, int usuarioId, int materiaId, int totalQuestoes, int totalAcertos)
        {
            Nome = nome;
            DataAplicacao = dataAplicacao;
            UsuarioId = usuarioId;
            MateriaId = materiaId;
            TotalQuestoes = totalQuestoes;
            TotalAcertos = totalAcertos;
            Ativo = true;
        }

        public void AtualizarDados(string nome, DateTime dataAplicacao, int usuarioId, int materiaId, int totalQuestoes, int totalAcertos)
        {            
            Nome = nome;
            DataAplicacao = dataAplicacao;
            UsuarioId = usuarioId;
            MateriaId = materiaId;
            TotalQuestoes = totalQuestoes;
            TotalAcertos = totalAcertos;
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
