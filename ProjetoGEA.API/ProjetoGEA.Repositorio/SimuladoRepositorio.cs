using Microsoft.EntityFrameworkCore;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public class SimuladoRepositorio : BaseRepositorio, ISimuladoRepositorio
    {
        public SimuladoRepositorio(ProjetoGEAContexto contexto) : base(contexto)
        {
        }

        public async Task<int> CriarAsync(Simulado simulado)
        {
            _contexto.Simulados.Add(simulado);
            await _contexto.SaveChangesAsync();
            return simulado.Id;
        }

        public async Task AtualizarAsync(Simulado simulado)
        {
            _contexto.Simulados.Update(simulado);
            await _contexto.SaveChangesAsync();
        }

        public async Task<Simulado> ObterPorIdAsync(int simuladoId)
        {
            return await _contexto.Simulados
                .Where(s => s.Id == simuladoId && s.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<Simulado> ObterDesativoAsync(int simuladoId)
        {
            return await _contexto.Simulados
                .Where(s => s.Id == simuladoId && !s.Ativo)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Simulado>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _contexto.Simulados
                .Where(s => s.UsuarioId == usuarioId && s.Ativo == ativo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Simulado>> ListarPorMateriaAsync(int materiaId, bool ativo)
        {
            return await _contexto.Simulados
                .Where(s => s.MateriaId == materiaId && s.Ativo == ativo)
                .ToListAsync();
        }

        public async Task<IEnumerable<Simulado>> ListarAsync(bool ativo)
        {
            return await _contexto.Simulados
                .Where(s => s.Ativo == ativo)
                .ToListAsync();
        }
    }
}
