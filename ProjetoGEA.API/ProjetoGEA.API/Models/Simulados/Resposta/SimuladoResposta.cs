using ProjetoGEA.Dominio.Entidades;
namespace ProjetoGEA.Api.Models.Simulados.Resposta
{
    public class SimuladoResposta
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public DateTime DataAplicacao { get; set; }
        public int UsuarioId { get; set; }
        public int MateriaId { get; set; }
        public int TotalQuestoes { get; set; }
        public int TotalAcertos { get; set; }
        public double PercentualAproveitamento { get; set; }

        public SimuladoResposta(Simulado simulado)
        {
            Id = simulado.Id;
            Nome = simulado.Nome;
            DataAplicacao = simulado.DataAplicacao;
            UsuarioId = simulado.UsuarioId;
            MateriaId = simulado.MateriaId;
            TotalQuestoes = simulado.TotalQuestoes;
            TotalAcertos = simulado.TotalAcertos;
            PercentualAproveitamento = simulado.PercentualAproveitamento;
        }
    }
}
