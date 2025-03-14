using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Aplicacao
{
    public interface ISimuladoAplicacao
    {
        Task<int> CriarAsync(Simulado simuladoDTO);
        Task AtualizarAsync(Simulado simuladoDTO);
        Task DeletarAsync(int simuladoId);
        Task RestaurarAsync(int simuladoId);
        Task<Simulado> ObterPorIdAsync(int simuladoId);
        Task<IEnumerable<Simulado>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<Simulado>> ListarPorMateriaAsync(int materiaId, bool ativo);
        Task<IEnumerable<Simulado>> ListarAsync(bool ativo);
    }
}
