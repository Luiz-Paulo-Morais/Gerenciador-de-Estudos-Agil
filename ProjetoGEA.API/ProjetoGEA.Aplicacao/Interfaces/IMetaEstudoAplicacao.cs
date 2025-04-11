using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Aplicacao
{
    public interface IMetaEstudoAplicacao
    {
        Task<int> AdicionarAsync(MetaEstudo meta);
        Task AtualizarAsync(MetaEstudo meta);
        Task DeletarAsync(int metaEstudoId);
        Task<MetaEstudo> ObterPorIdAsync(int id);
        Task<IEnumerable<MetaEstudo>> ListarPorUsuarioAsync(int usuarioId, bool ativo);
        Task<IEnumerable<MetaEstudo>> ListarPorMateriaAsync(int materiaId, bool ativo);
        Task<IEnumerable<MetaEstudo>> ListarPorSprintAsync(int sprintId, bool ativo);
        //Task<IEnumerable<MetaEstudo>> ListarPorTarefaAsync(int tarefaId, bool ativo);
    }
}
