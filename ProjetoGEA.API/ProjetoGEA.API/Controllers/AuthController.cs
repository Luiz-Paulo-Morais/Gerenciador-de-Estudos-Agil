using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Aplicacao;
using System.Threading.Tasks;
using ProjetoGEA.Api.Models;

namespace ProjetoGEA.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest model)
        {
            var result = await _authService.RegisterUserAsync(model.Email, model.Password, model.Nome);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Erro ao registrar usuário", errors = result.Errors });
            }

            return Ok(new { message = "Usuário registrado com sucesso!" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest model)
        {
            var token = await _authService.LoginUserAsync(model.Email, model.Password);

            if (token == null)
            {
                return Unauthorized(new { message = "Credenciais inválidas!" });
            }

            return Ok(new { token });
        }
    }
}
