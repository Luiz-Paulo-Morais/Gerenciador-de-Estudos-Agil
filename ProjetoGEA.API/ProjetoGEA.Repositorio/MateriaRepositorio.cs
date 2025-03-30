using Microsoft.EntityFrameworkCore;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public class MateriaRepositorio : BaseRepositorio, IMateriaRepositorio
    {
        public MateriaRepositorio(ProjetoGEAContexto contexto) : base(contexto)
        {
        }

        public async Task<int> CriarAsync(Materia materia)
        {
            _contexto.Materias.Add(materia);
            await _contexto.SaveChangesAsync();
            return materia.Id;
        }

        public async Task AtualizarAsync(Materia materia)
        {
            _contexto.Materias.Update(materia);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Materia> ObterPorIdAsync(int materiaId)
        {
            return await _contexto.Materias
                .Where(m => m.Id == materiaId && m.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<Materia> ObterDesativoAsync(int materiaId)
        {
            return await _contexto.Materias
                .Where(m => m.Id == materiaId && !m.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Materia>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _contexto.Materias
                .Where(m => m.UsuarioId == usuarioId && m.Ativo == ativo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Materia>> ListarAsync(bool ativo)
        {
            return await _contexto.Materias
                .Where(m => m.Ativo == ativo)
                .ToListAsync();
        }
    }
}
