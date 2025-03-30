using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ProjetoGEA.Api.Models.Materias.Requisicao;
using ProjetoGEA.Api.Models.Materias.Resposta;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Dominio.Enumeradores;
using System.Security.Claims;

namespace ProjetoGEA.Api.Controllers
{
    [Authorize] // Apenas usuários autenticados podem acessar
    [ApiController]
    [Route("[controller]")]
    public class MateriaController : ControllerBase
    {
        private readonly IMateriaAplicacao _materiaAplicacao;

        public MateriaController(IMateriaAplicacao materiaAplicacao)
        {
            _materiaAplicacao = materiaAplicacao;
        }

        /// <summary>
        /// Obtém o ID do usuário autenticado e seu papel (Administrador, Default, Convidado)
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

        [HttpGet]
        [Route("Obter/{materiaId}")]
        public async Task<ActionResult> ObterAsync([FromRoute] int materiaId)
        {
            try
            {
                var materiaDominio = await _materiaAplicacao.ObterPorIdAsync(materiaId);
                return Ok(new MateriaResposta(materiaDominio));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<ActionResult> CriarAsync([FromBody] MateriaCriar materiaCriar)
        {
            try
            {
                var (usuarioId, tipoUsuario) = ObterUsuarioAutenticado();

                if (tipoUsuario == TiposUsuario.Convidado)
                {
                    return Forbid("Convidados não podem criar matérias.");
                }

                var materia = new Materia()
                {
                    Nome = materiaCriar.Nome,
                    Descricao = materiaCriar.Descricao,
                    UsuarioId = usuarioId // Garante que o usuário autenticado seja o dono
                };

                var materiaId = await _materiaAplicacao.CriarAsync(materia);
                return Ok(materiaId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<ActionResult> AtualizarAsync([FromBody] MateriaAtualizar materiaAtualizar)
        {
            try
            {
                var (usuarioId, tipoUsuario) = ObterUsuarioAutenticado();
                var materia = await _materiaAplicacao.ObterPorIdAsync(materiaAtualizar.Id);

                if (materia == null)
                    return NotFound("Matéria não encontrada.");

                // 🔒 Convidados não podem editar
                if (tipoUsuario == TiposUsuario.Convidado)
                    return Forbid("Convidados não podem editar matérias.");

                // 🔒 Usuários Default só podem editar suas próprias matérias
                if (tipoUsuario == TiposUsuario.Default && materia.UsuarioId != usuarioId)
                    return Forbid("Usuários padrão só podem editar suas próprias matérias.");

                materia.Nome = materiaAtualizar.Nome;
                materia.Descricao = materiaAtualizar.Descricao;
                await _materiaAplicacao.AtualizarAsync(materia);
                return Ok("Matéria atualizada com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{materiaId}")]
        public async Task<ActionResult> DeletarAsync([FromRoute] int materiaId)
        {
            try
            {
                var (usuarioId, tipoUsuario) = ObterUsuarioAutenticado();
                var materia = await _materiaAplicacao.ObterPorIdAsync(materiaId);

                if (materia == null)
                    return NotFound("Matéria não encontrada.");

                // 🔒 Convidados não podem excluir
                if (tipoUsuario == TiposUsuario.Convidado)
                    return Forbid("Convidados não podem excluir matérias.");

                // 🔒 Usuários Default só podem excluir suas próprias matérias
                if (tipoUsuario == TiposUsuario.Default && materia.UsuarioId != usuarioId)
                    return Forbid("Usuários padrão só podem excluir suas próprias matérias.");

                await _materiaAplicacao.DeletarAsync(materiaId);
                return Ok("Matéria excluída com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{materiaId}")]
        public async Task<ActionResult> RestaurarAsync([FromRoute] int materiaId)
        {
            try
            {
                var (usuarioId, tipoUsuario) = ObterUsuarioAutenticado();
                var materia = await _materiaAplicacao.ObterPorIdAsync(materiaId);

                if (materia == null)
                    return NotFound("Matéria não encontrada.");

                // 🔒 Apenas Administradores podem restaurar qualquer matéria
                if (tipoUsuario == TiposUsuario.Default && materia.UsuarioId != usuarioId)
                    return Forbid("Usuários padrão só podem restaurar suas próprias matérias.");

                await _materiaAplicacao.RestaurarAsync(materiaId);
                return Ok("Matéria restaurada com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("Listar")]
        public async Task<ActionResult> ListarAsync([FromQuery] bool ativos)
        {
            try
            {
                var materiasDominio = await _materiaAplicacao.ListarAsync(ativos);
                var materias = materiasDominio.Select(materia => new MateriaResposta(materia)).ToList();
                return Ok(materias);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorUsuario/{usuarioId}")]
        public async Task<ActionResult> ListarPorUsuarioAsync([FromRoute] int usuarioId, [FromQuery] bool ativo)
        {
            try
            {
                var materiasDominio = await _materiaAplicacao.ListarPorUsuarioAsync(usuarioId, ativo);
                var materias = materiasDominio.Select(m => new MateriaResposta(m)).ToList();
                return Ok(materias);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
