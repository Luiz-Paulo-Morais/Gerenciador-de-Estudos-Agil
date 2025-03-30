using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Dominio.Enumeradores;

namespace ProjetoGEA.Aplicacao
{
    public class AuthService
    {
        private readonly UserManager<Usuario> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IUsuarioAplicacao _usuarioAplicacao;

        public AuthService(UserManager<Usuario> userManager, IConfiguration configuration, IUsuarioAplicacao usuarioAplicacao)
        {
            _userManager = userManager;
            _configuration = configuration;
            _usuarioAplicacao = usuarioAplicacao;
        }

        // 🔹 Método para Alterar Senha
        public async Task<IdentityResult> AlterarSenhaAsync(int userId, string senhaAtual, string novaSenha)
        {
            var usuario = await _userManager.FindByIdAsync(userId.ToString());
            if (usuario == null)
                return IdentityResult.Failed(new IdentityError { Description = "Usuário não encontrado." });

            var resultado = await _userManager.ChangePasswordAsync(usuario, senhaAtual, novaSenha);

            return resultado;
        }


        // 🔹 Método para obter usuário autenticado a partir das Claims
        public async Task<Usuario> GetUsuarioAutenticadoAsync(ClaimsPrincipal user)
        {
            var userId = user.FindFirst("id")?.Value;
            var tipoUsuarioClaim = user.FindFirst("tipoUsuario")?.Value;

            if (string.IsNullOrEmpty(userId) || !int.TryParse(tipoUsuarioClaim, out int tipoUsuario))
            {
                return null; // Usuário não autenticado ou claims inválidas
            }

            // Busca o usuário no banco para garantir que existe
            var usuario = await _usuarioAplicacao.ObterPorIdAsync(int.Parse(userId));

            if (usuario == null)
            {
                return null;
            }

            return new Usuario

            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                TipoUsuario = (TiposUsuario)tipoUsuario
            };
        }

        public async Task<IdentityResult> RegisterUserAsync(string email, string password, string nome, TiposUsuario tipoUsuario)
        {
            var user = new Usuario { UserName = email, Email = email, Nome = nome, TipoUsuario = tipoUsuario };
            return await _userManager.CreateAsync(user, password);
        }

        public async Task<string> LoginUserAsync(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            {
                return null; // Credenciais inválidas
            }

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(Usuario usuario)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("id", usuario.Id.ToString()),
                new Claim("nome", usuario.Nome),
                new Claim(ClaimTypes.Email, usuario.Email), // ✅ E-mail corretamente
                new Claim("tipoUsuario", ((int)usuario.TipoUsuario).ToString()), // ✅ Agora está correto!
                new Claim(ClaimTypes.Role, usuario.TipoUsuario.ToString()) // ✅ Adiciona Role
            };

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // 🚀 LOG PARA DEPURAÇÃO
            Console.WriteLine($"[DEBUG] Token Gerado: {tokenString}");

            return tokenString;

            //return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}