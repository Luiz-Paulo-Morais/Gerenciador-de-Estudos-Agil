using Microsoft.EntityFrameworkCore;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio
{
    public class UsuarioRepositorio : BaseRepositorio, IUsuarioRepositorio
    {
        public UsuarioRepositorio(ProjetoGEAContexto contexto) : base(contexto)
        {
        }

        public async Task<int> CriarAsync(Usuario usuario)
        {
            _contexto.Usuarios.Add(usuario);
            await _contexto.SaveChangesAsync();

            return usuario.Id;
        }
        public async Task AtualizarAsync(Usuario usuario)
        {
            _contexto.Usuarios.Update(usuario);
            await _contexto.SaveChangesAsync();
        }
        public async Task<Usuario> ObterPorIdAsync(int usuarioId)
        {
            return await _contexto.Usuarios
                .Where(u => u.Id == usuarioId && u.Ativo)                
                .FirstOrDefaultAsync();
        }
        public async Task<Usuario> ObterDesativoAsync(int usuarioId)
        {
            return await _contexto.Usuarios
                .Where(u => u.Id == usuarioId)
                .Where(u => u.Ativo == false)
                .FirstOrDefaultAsync();
        }
        public async Task<Usuario> ObterPorEmailAsync(string email)
        {
            return await _contexto.Usuarios
                .Where(u => u.Email == email)
                .Where(u => u.Ativo)
                .FirstOrDefaultAsync();
        }      
        public async Task<int> ObterIdPorNomeAsync(string nome)
        {
            return await _contexto.Usuarios
                .Where(u => u.Nome == nome && u.Ativo)
                .Select(u => u.Id)
                .FirstOrDefaultAsync();
        }      
        public async Task<IEnumerable<Usuario>> ListarAsync(bool ativo)
        {
            return await _contexto.Usuarios
                .Where(u=>u.Ativo == ativo)
                .ToListAsync();
        }
    }
}