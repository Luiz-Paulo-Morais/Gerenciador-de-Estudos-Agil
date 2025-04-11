using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ProjetoGEA.Api.Models.Usuarios.Requisicao;
using ProjetoGEA.Api.Models.Usuarios.Resposta;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Dominio.Enumeradores;
using System.Security.Claims;

namespace ProjetoGEA.Api.Controllers
{
    [Authorize] // Apenas usuários autenticados podem acessar
    [ApiController]
    [Route("[controller]")]
    public class UsuarioController : ControllerBase
    {
        private readonly IUsuarioAplicacao _usuarioAplicacao;
        private readonly AuthService _authService;

        public UsuarioController(IUsuarioAplicacao usuarioAplicacao, AuthService authService)
        {
            _usuarioAplicacao = usuarioAplicacao;
            _authService = authService;
        }

        /// <summary>
        /// Obtém o ID e o Tipo de Usuário autenticado via JWT
        /// </summary>
        private (int UsuarioId, TiposUsuario TipoUsuario) ObterUsuarioAutenticado()
        {
            var usuarioIdClaim = User.FindFirst("id")?.Value;
            var tipoUsuarioClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (!int.TryParse(usuarioIdClaim, out int usuarioId) || !Enum.TryParse(tipoUsuarioClaim, out TiposUsuario tipoUsuario))
            {
                throw new UnauthorizedAccessException("Usuário não autenticado ou sem permissões.");
            }

            return (usuarioId, tipoUsuario);
        }

        [HttpGet("debug-token")]
        public IActionResult DebugToken()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            if (identity != null)
            {
                var claims = identity.Claims.Select(c => new { c.Type, c.Value }).ToList();
                return Ok(new { message = "Token válido", claims });
            }

            return Unauthorized(new { message = "Token inválido ou ausente" });
        }

        [HttpGet("Obter/{usuarioId}")]
        public async Task<ActionResult> ObterAsync([FromRoute] int usuarioId)
        {
            try
            {
                var (autenticadoId, tipoUsuario) = ObterUsuarioAutenticado();

                // 🔒 Usuários Default só podem visualizar seus próprios dados
                if (tipoUsuario == TiposUsuario.Default && usuarioId != autenticadoId)
                    return Forbid("Usuários padrão só podem visualizar seus próprios dados.");

                var usuario = await _usuarioAplicacao.ObterPorIdAsync(usuarioId);
                return Ok(new UsuarioResposta(usuario));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Criar")]
        public async Task<ActionResult> CriarAsync([FromBody] UsuarioCriar usuarioCriar)
        {
            try
            {
                var (_, tipoUsuario) = ObterUsuarioAutenticado();

                // 🔒 Apenas Administradores podem criar novos usuários
                if (tipoUsuario != TiposUsuario.Administrador)
                    return Forbid("Apenas administradores podem criar novos usuários.");

                var usuario = new Usuario()
                {
                    Nome = usuarioCriar.Nome,
                    Email = usuarioCriar.Email,
                    TipoUsuario = usuarioCriar.TipoUsuario
                };

                var usuarioId = await _usuarioAplicacao.CriarAsync(usuario);
                return Ok(usuarioId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Atualizar")]
        public async Task<ActionResult> AtualizarAsync([FromBody] UsuarioAtualizar usuarioAtualizar)
        {
            try
            {
                var (autenticadoId, tipoUsuario) = ObterUsuarioAutenticado();

                // 🔒 Usuários padrão só podem atualizar seus próprios dados
                if (tipoUsuario == TiposUsuario.Default && usuarioAtualizar.Id != autenticadoId)
                    return Forbid("Usuários padrão só podem atualizar seus próprios dados.");

                var usuario = await _usuarioAplicacao.ObterPorIdAsync(usuarioAtualizar.Id);
                if (usuario == null) return NotFound("Usuário não encontrado.");

                usuario.Nome = usuarioAtualizar.Nome;
                usuario.Email = usuarioAtualizar.Email;

                // 🔒 Apenas administradores podem alterar o Tipo de Usuário
                if (tipoUsuario == TiposUsuario.Administrador)
                {
                    usuario.TipoUsuario = usuarioAtualizar.TipoUsuario;
                }

                await _usuarioAplicacao.AtualizarAsync(usuario);
                return Ok("Usuário atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("AlterarSenha")]
        public async Task<ActionResult> AlterarSenhaAsync([FromBody] UsuarioAlterarSenha usuarioAlterarSenha)
        {
            try
            {
                var (autenticadoId, autenticadoTipo) = ObterUsuarioAutenticado(); // autenticadoTipo agora é TiposUsuario
                var usuarioAlvo = await ObterAsync(usuarioAlterarSenha.UserId);

                if (usuarioAlvo == null)
                    return NotFound("Usuário não encontrado.");

                // 🔐 Se não for administrador, só pode alterar a própria senha
                if (autenticadoTipo != TiposUsuario.Administrador && usuarioAlterarSenha.UserId != autenticadoId)
                    return Forbid("Você só pode alterar sua própria senha.");

                var resultado = await _authService.AlterarSenhaAsync(
                    usuarioAlterarSenha.UserId,
                    usuarioAlterarSenha.SenhaAtual,
                    usuarioAlterarSenha.NovaSenha
                );

                if (!resultado.Succeeded)
                    return BadRequest(resultado.Errors);

                return Ok("Senha alterada com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao alterar senha: {ex.Message}");
            }
        }


        [HttpDelete("Deletar/{usuarioId}")]
        public async Task<ActionResult> DeletarAsync([FromRoute] int usuarioId)
        {
            try
            {
                var (_, tipoUsuario) = ObterUsuarioAutenticado();

                // 🔒 Apenas Administradores podem excluir usuários
                if (tipoUsuario != TiposUsuario.Administrador)
                    return Forbid("Apenas administradores podem excluir usuários.");

                await _usuarioAplicacao.DeletarAsync(usuarioId);
                return Ok("Usuário excluído com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("Restaurar/{usuarioId}")]
        public async Task<ActionResult> RestaurarAsync([FromRoute] int usuarioId)
        {
            try
            {
                var (_, tipoUsuario) = ObterUsuarioAutenticado();

                // 🔒 Apenas Administradores podem restaurar usuários
                if (tipoUsuario != TiposUsuario.Administrador)
                    return Forbid("Apenas administradores podem restaurar usuários.");

                await _usuarioAplicacao.RestaurarAsync(usuarioId);
                return Ok("Usuário restaurado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Listar")]
        public async Task<ActionResult> ListarAsync([FromQuery] bool ativos)
        {
            try
            {
                var usuarios = await _usuarioAplicacao.ListarAsync(ativos);
                return Ok(usuarios.Select(usuario => new UsuarioResposta(usuario)).ToList());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ListarTiposUsuario")]
        public ActionResult ListarTiposUsuarioAsync()
        {
            try
            {
                var tiposUsuario = Enum.GetValues(typeof(TiposUsuario))
                    .Cast<TiposUsuario>()
                    .Select(tipo => new TipoUsuarioResposta
                    {
                        Id = (int)tipo,
                        Nome = tipo.ToString()
                    })
                    .ToList();

                return Ok(tiposUsuario);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}