using ProjetoGEA.Dominio.Entidades;
using Microsoft.EntityFrameworkCore;

namespace ProjetoGEA.Repositorio
{

    public class MetaEstudoRepositorio : BaseRepositorio, IMetaEstudoRepositorio
    {

        public MetaEstudoRepositorio(ProjetoGEAContexto contexto) : base(contexto)
        {
        }

        private IQueryable<MetaEstudo> IncluirRelacionamentos(IQueryable<MetaEstudo> query)
        {
            return query                
                .Include(c => c.Materia)
                .Include(c => c.Sprint);
        }

        public async Task<int> AdicionarAsync(MetaEstudo meta)
        {
            _contexto.MetasEstudo.AddAsync(meta);
            await _contexto.SaveChangesAsync();
            return meta.Id;
        }
       
        public async Task<IEnumerable<MetaEstudo>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            var query = _contexto.MetasEstudo
                .Where(m => m.UsuarioId == usuarioId && m.Ativo == ativo);

            return await IncluirRelacionamentos(query).ToListAsync();           
            
        }

        public async Task<IEnumerable<MetaEstudo>> ListarPorMateriaAsync(int materiaId, bool ativo)
        {
            var query = _contexto.MetasEstudo
                .Where(m => m.MateriaId == materiaId && m.Ativo == ativo);

            return await IncluirRelacionamentos(query).ToListAsync();
        }

        public async Task<IEnumerable<MetaEstudo>> ListarPorSprintAsync(int sprintId, bool ativo)
        {
            var query = _contexto.MetasEstudo
                .Where(m => m.SprintId == sprintId && m.Ativo == ativo);

            return await IncluirRelacionamentos(query).ToListAsync();
        }

        // public async Task<IEnumerable<MetaEstudo>> ListarPorTarefaAsync(int tarefaId, bool ativo)
        // {
        //     var query = _contexto.MetasEstudo
        //         .Where(m => m.TarefaId == tarefaId && m.Ativo == ativo);

        //     return await IncluirRelacionamentos(query).ToListAsync();            
        // }
     

        public async Task<MetaEstudo> ObterPorIdAsync(int id)
        {
            return await _contexto.MetasEstudo
                .Where(m => m.Id == id && m.Ativo)
                .FirstOrDefaultAsync();
        }       

        public async Task AtualizarAsync(MetaEstudo meta)
        {
            _contexto.MetasEstudo.Update(meta);
            await _contexto.SaveChangesAsync();
        }       
    }
}
