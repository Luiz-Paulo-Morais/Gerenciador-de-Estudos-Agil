using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Api.Models;
using System.Security.Claims;
using ProjetoGEA.Dominio.Enumeradores;
//using ProjetoGEA.Aplicacao;

namespace ProjetoGEA.API.Controllers
{

    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly IUsuarioAplicacao _usuarioAplicacao;

        public AuthController(AuthService authService, IUsuarioAplicacao usuarioAplicacao)
        {
            _authService = authService;
            _usuarioAplicacao = usuarioAplicacao;
        }

        [HttpOptions("login")]
        public IActionResult Preflight()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "http://localhost:3000");
            Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization");
            Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            return Ok();
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var claims = User.Claims.ToList();
            Console.WriteLine("🚀 Claims recebidos:");
            foreach (var claim in claims)
            {
                Console.WriteLine($"{claim.Type}: {claim.Value}");
            }

            var userId = User.FindFirst("id")?.Value;
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;
            var tipoUsuarioClaim = User.FindFirst("tipoUsuario")?.Value;

            Console.WriteLine($"🔍 userId: {userId}");
            Console.WriteLine($"🔍 userEmail: {userEmail}");
            Console.WriteLine($"🔍 tipoUsuarioClaim: {tipoUsuarioClaim}");

            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Usuário não autenticado" });

            if (!int.TryParse(tipoUsuarioClaim, out int tipoUsuario))
                return BadRequest(new { message = "Tipo de usuário inválido no token" });

            // 🔍 Buscar nome no banco de dados
            var usuario = await _usuarioAplicacao.ObterPorIdAsync(int.Parse(userId));
            if (usuario == null)
                return Unauthorized(new { message = "Usuário não encontrado" });

            return Ok(new
            {
                userId,
                userEmail = userEmail ?? usuario.Email,
                nome = usuario.Nome,
                tipoUsuario = tipoUsuario
            });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            // Tipo padrão para usuários não autenticados
            TiposUsuario tipoUsuario = TiposUsuario.Default;

            // Obtém o usuário autenticado
            var usuarioAutenticado = await _authService.GetUsuarioAutenticadoAsync(User);

            if (usuarioAutenticado != null && usuarioAutenticado.TipoUsuario == TiposUsuario.Administrador)
            {
                // Apenas administradores podem definir um tipo diferente de "Default"
                tipoUsuario = model.TipoUsuario;
            }

            var result = await _authService.RegisterUserAsync(model.Email, model.Password, model.Nome, tipoUsuario);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Erro ao registrar usuário", errors = result.Errors });
            }

            return Ok(new { message = "Usuário registrado com sucesso!" });
        }


        /*
                [HttpPost("register")]
                public async Task<IActionResult> Register([FromBody] RegisterRequest model)
                {
                    var result = await _authService.RegisterUserAsync(model.Email, model.Password, model.Nome, model.TipoUsuario);

                    if (!result.Succeeded)
                    {
                        return BadRequest(new { message = "Erro ao registrar usuário", errors = result.Errors });
                    }

                    return Ok(new { message = "Usuário registrado com sucesso!" });
                }

                */

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var token = await _authService.LoginUserAsync(model.Email, model.Password);

            if (token == null)
            {
                return Unauthorized(new { message = "Credenciais inválidas!" });
            }

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,  // Impede acesso via JavaScript
                Secure = true,    // Exige HTTPS (desative para testes locais)
                SameSite = SameSiteMode.Strict, // Permite cookies em requisições CORS
                Expires = DateTime.UtcNow.AddHours(2) // Define tempo de expiração
            };

            Response.Cookies.Append("token", token, cookieOptions);

            Console.WriteLine($"Token = {token}");

            return Ok(new { message = "Login realizado com sucesso!" });
        }
    }
}
