namespace ProjetoGEA.Api.Models.Materias.Requisicao
{
    public class MateriaAtualizar
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public int UsuarioId { get; set; }
    }
}
