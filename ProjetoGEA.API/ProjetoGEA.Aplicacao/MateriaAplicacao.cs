using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Repositorio;

namespace ProjetoGEA.Aplicacao
{
    public class MateriaAplicacao : IMateriaAplicacao
    {
        private readonly IMateriaRepositorio _materiaRepositorio;

        public MateriaAplicacao(IMateriaRepositorio materiaRepositorio)
        {
            _materiaRepositorio = materiaRepositorio;
        }

        public async Task<int> CriarAsync(Materia materia)
        {
            if (materia == null)
            {
                throw new Exception("Matéria não pode ser vazia");
            }

            await ValidarInformacoesMateriaAsync(materia);

            return await _materiaRepositorio.CriarAsync(materia);
        }

        public async Task AtualizarAsync(Materia materia)
        {
            var materiaDominio = await _materiaRepositorio.ObterPorIdAsync(materia.Id);

            if (materiaDominio == null)
            {
                throw new Exception("Matéria não encontrada");
            }

            await ValidarInformacoesMateriaAsync(materia);

            materiaDominio.Nome = materia.Nome;
            materiaDominio.Descricao = materia.Descricao;
            materiaDominio.UsuarioId = materia.UsuarioId;

            await _materiaRepositorio.AtualizarAsync(materiaDominio);
        }

        public async Task DeletarAsync(int materiaId)
        {
            var materiaDominio = await _materiaRepositorio.ObterPorIdAsync(materiaId);
            if (materiaDominio == null)
            {
                throw new Exception("Matéria não encontrada");
            }

            materiaDominio.Deletar();
            await _materiaRepositorio.AtualizarAsync(materiaDominio);
        }

        public async Task RestaurarAsync(int materiaId)
        {
            var materiaDominio = await _materiaRepositorio.ObterDesativoAsync(materiaId);
            if (materiaDominio == null)
            {
                throw new Exception("Matéria não encontrada");
            }

            materiaDominio.Restaurar();
            await _materiaRepositorio.AtualizarAsync(materiaDominio);
        }

        public async Task<Materia> ObterPorIdAsync(int materiaId)
        {
            return await _materiaRepositorio.ObterPorIdAsync(materiaId)
                ?? throw new Exception("Matéria não encontrada");
        }

        public async Task<IEnumerable<Materia>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _materiaRepositorio.ListarPorUsuarioAsync(usuarioId, ativo);
        }
        
        public async Task<IEnumerable<Materia>> ListarAsync(bool ativo)
        {
            return await _materiaRepositorio.ListarAsync(ativo);
        }

        private static async Task ValidarInformacoesMateriaAsync(Materia materia)
        {
            if (string.IsNullOrEmpty(materia.Nome))
            {
                throw new Exception("Nome da matéria não pode ser vazio");
            }
        }
    }
}
