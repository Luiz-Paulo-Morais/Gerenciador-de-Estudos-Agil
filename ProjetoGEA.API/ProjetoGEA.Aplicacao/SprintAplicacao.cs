using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Repositorio;

namespace ProjetoGEA.Aplicacao
{
    public class SprintAplicacao : ISprintAplicacao
    {
        private readonly ISprintRepositorio _sprintRepositorio;

        public SprintAplicacao(ISprintRepositorio sprintRepositorio)
        {
            _sprintRepositorio = sprintRepositorio;
        }

        public async Task<int> CriarAsync(Sprint sprint)
        {
            if (sprint == null)
            {
                throw new Exception("Sprint não pode ser vazia");
            }

            return await _sprintRepositorio.CriarAsync(sprint);
        }

        public async Task AtualizarAsync(Sprint sprint)
        {
            var sprintDominio = await _sprintRepositorio.ObterPorIdAsync(sprint.Id);
            if (sprintDominio == null)
            {
                throw new Exception("Sprint não encontrada");
            }

            sprintDominio.Nome = sprint.Nome;
            sprintDominio.DataInicio = sprint.DataInicio;
            sprintDominio.DataFim = sprint.DataFim;
            sprintDominio.UsuarioId = sprint.UsuarioId;

            await _sprintRepositorio.AtualizarAsync(sprintDominio);
        }

        public async Task DeletarAsync(int sprintId)
        {
            var sprintDominio = await _sprintRepositorio.ObterPorIdAsync(sprintId);
            if (sprintDominio == null)
            {
                throw new Exception("Sprint não encontrada");
            }

            sprintDominio.Deletar();
            await _sprintRepositorio.AtualizarAsync(sprintDominio);
        }

        public async Task RestaurarAsync(int sprintId)
        {
            var sprintDominio = await _sprintRepositorio.ObterDesativoAsync(sprintId);
            if (sprintDominio == null)
            {
                throw new Exception("Sprint não encontrada");
            }

            sprintDominio.Restaurar();
            await _sprintRepositorio.AtualizarAsync(sprintDominio);
        }

        public async Task<Sprint> ObterPorIdAsync(int sprintId)
        {
            return await _sprintRepositorio.ObterPorIdAsync(sprintId)
                ?? throw new Exception("Sprint não encontrada");
        }

        public async Task<IEnumerable<Sprint>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _sprintRepositorio.ListarPorUsuarioAsync(usuarioId, ativo);
        }
        
        public async Task<IEnumerable<Sprint>> ListarAsync(bool ativo)
        {
            return await _sprintRepositorio.ListarAsync(ativo);
        }
    }
}
