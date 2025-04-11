using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Repositorio;

namespace ProjetoGEA.Aplicacao
{
    public class MetaEstudoAplicacao : IMetaEstudoAplicacao
    {
        private readonly IMetaEstudoRepositorio _metaEstudoRepositorio;

        public MetaEstudoAplicacao(IMetaEstudoRepositorio metaEstudoRepositorio)
        {
            _metaEstudoRepositorio = metaEstudoRepositorio;
        }

        public async Task<int> AdicionarAsync(MetaEstudo meta)
        {
            if (meta == null)
            {
                throw new Exception("Meta de Estudo não pode ser vazio");
            }

            return await _metaEstudoRepositorio.AdicionarAsync(meta);
        }

        public async Task<IEnumerable<MetaEstudo>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _metaEstudoRepositorio.ListarPorUsuarioAsync(usuarioId, ativo);
        }

        public async Task<IEnumerable<MetaEstudo>> ListarPorMateriaAsync(int materiaId, bool ativo)
        {
            return await _metaEstudoRepositorio.ListarPorMateriaAsync(materiaId, ativo);
        }

        public async Task<IEnumerable<MetaEstudo>> ListarPorSprintAsync(int sprintId, bool ativo)
        {
            return await _metaEstudoRepositorio.ListarPorSprintAsync(sprintId, ativo);
        }
        // public async Task<IEnumerable<MetaEstudo>> ListarPorTarefaAsync(int tarefaId, bool ativo)
        // {
        //     return await _metaEstudoRepositorio.ListarPorTarefaAsync(tarefaId, ativo);
        // }

        public async Task<MetaEstudo> ObterPorIdAsync(int metaEstudoId)
        {
            return await _metaEstudoRepositorio.ObterPorIdAsync(metaEstudoId)
                ?? throw new Exception("Meta de Estudo não encontrada");
        }

        public async Task DeletarAsync(int metaEstudoId)
        {
            var metaEstudoDominio = await _metaEstudoRepositorio.ObterPorIdAsync(metaEstudoId);
            if (metaEstudoDominio == null)
            {
                throw new Exception("Meta de Estudo não encontrado");
            }

            metaEstudoDominio.Deletar();
            await _metaEstudoRepositorio.AtualizarAsync(metaEstudoDominio);
        }

        public async Task AtualizarAsync(MetaEstudo meta)
        {
            var metaDominio = await _metaEstudoRepositorio.ObterPorIdAsync(meta.Id);
            if (metaDominio == null)
            {
                throw new Exception("Meta de Estudo não encontrada");
            }         

            metaDominio.UsuarioId = meta.UsuarioId;
            metaDominio.SprintId = meta.SprintId;
            metaDominio.MateriaId = meta.MateriaId;
            metaDominio.HorasPlanejadas = meta.HorasPlanejadas;

            await _metaEstudoRepositorio.AtualizarAsync(metaDominio);
        }

    }
}
