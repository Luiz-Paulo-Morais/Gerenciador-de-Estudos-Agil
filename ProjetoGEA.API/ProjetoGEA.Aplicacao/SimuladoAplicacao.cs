using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Repositorio;

namespace ProjetoGEA.Aplicacao
{
    public class SimuladoAplicacao : ISimuladoAplicacao
    {
        private readonly ISimuladoRepositorio _simuladoRepositorio;

        public SimuladoAplicacao(ISimuladoRepositorio simuladoRepositorio)
        {
            _simuladoRepositorio = simuladoRepositorio;
        }

        public async Task<int> CriarAsync(Simulado simulado)
        {
            if (simulado == null)
            {
                throw new Exception("Simulado não pode ser vazio");
            }

            return await _simuladoRepositorio.CriarAsync(simulado);
        }

        public async Task AtualizarAsync(Simulado simulado)
        {
            var simuladoDominio = await _simuladoRepositorio.ObterPorIdAsync(simulado.Id);
            if (simuladoDominio == null)
            {
                throw new Exception("Simulado não encontrado");
            }

            simuladoDominio.AtualizarDados(
                simulado.Nome,
                simulado.DataAplicacao,
                simulado.UsuarioId,
                simulado.MateriaId,
                simulado.TotalQuestoes,
                simulado.TotalAcertos
            );


            await _simuladoRepositorio.AtualizarAsync(simuladoDominio);
        }

        public async Task DeletarAsync(int simuladoId)
        {
            var simuladoDominio = await _simuladoRepositorio.ObterPorIdAsync(simuladoId);
            if (simuladoDominio == null)
            {
                throw new Exception("Simulado não encontrado");
            }

            simuladoDominio.Deletar();
            await _simuladoRepositorio.AtualizarAsync(simuladoDominio);
        }

        public async Task RestaurarAsync(int simuladoId)
        {
            var simuladoDominio = await _simuladoRepositorio.ObterDesativoAsync(simuladoId);
            if (simuladoDominio == null)
            {
                throw new Exception("Simulado não encontrado ou já está ativo");
            }

            simuladoDominio.Restaurar();
            await _simuladoRepositorio.AtualizarAsync(simuladoDominio);
        }

        public async Task<Simulado> ObterPorIdAsync(int simuladoId)
        {
            return await _simuladoRepositorio.ObterPorIdAsync(simuladoId)
                ?? throw new Exception("Simulado não encontrado");
        }

        public async Task<IEnumerable<Simulado>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _simuladoRepositorio.ListarPorUsuarioAsync(usuarioId, ativo);
        }

        public async Task<IEnumerable<Simulado>> ListarPorMateriaAsync(int materiaId, bool ativo)
        {
            return await _simuladoRepositorio.ListarPorMateriaAsync(materiaId, ativo);
        }


        public async Task<IEnumerable<Simulado>> ListarAsync(bool ativo)
        {
            return await _simuladoRepositorio.ListarAsync(ativo);
        }
    }
}
