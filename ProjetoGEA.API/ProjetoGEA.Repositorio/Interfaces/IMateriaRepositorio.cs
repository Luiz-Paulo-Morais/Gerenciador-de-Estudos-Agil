using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public interface IMateriaRepositorio
    {
        Task<int> CriarAsync(Materia materia);
        Task AtualizarAsync(Materia materia);
        Task<Materia> ObterPorIdAsync(int materiaId);
        Task<Materia> ObterDesativoAsync(int materiaId);
        Task<IEnumerable<Materia>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Materia>> ListarAsync(bool ativo);
    }
}