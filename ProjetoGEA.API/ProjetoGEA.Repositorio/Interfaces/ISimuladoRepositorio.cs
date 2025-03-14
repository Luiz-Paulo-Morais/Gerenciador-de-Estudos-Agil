using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public interface ISimuladoRepositorio
    {
        Task<int> CriarAsync(Simulado simulado);
        Task AtualizarAsync(Simulado simulado);
        Task<Simulado> ObterPorIdAsync(int simuladoId);
        Task<Simulado> ObterDesativoAsync(int simuladoId);
        Task<IEnumerable<Simulado>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Simulado>> ListarPorMateriaAsync(int materiaId, bool ativo);
        Task<IEnumerable<Simulado>> ListarAsync(bool ativo);
    }
}