namespace ProjetoGEA.Api.Models.Simulados.Requisicao
{
    public class SimuladoCriar
    {
        public string Nome { get; set; }
        public DateTime DataAplicacao { get; set; }
        public int UsuarioId { get; set; }
        public int MateriaId { get; set; }
        public int TotalQuestoes { get; set; }
        public int TotalAcertos { get; set; }
    }
}
