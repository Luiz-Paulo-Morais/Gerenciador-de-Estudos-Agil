using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Aplicacao
{
    public interface IMateriaAplicacao
    {
        Task<int> CriarAsync(Materia materiaDTO);
        Task AtualizarAsync(Materia materiaDTO);
        Task DeletarAsync(int materiaId);
        Task RestaurarAsync(int materiaId);
        Task<Materia> ObterPorIdAsync(int materiaId);
        Task<IEnumerable<Materia>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Materia>> ListarAsync(bool ativo);
    }
}
