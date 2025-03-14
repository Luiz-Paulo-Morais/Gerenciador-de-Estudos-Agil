using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Api.Models.Sprints.Requisicao;
using ProjetoGEA.Api.Models.Sprints.Resposta;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SprintController : ControllerBase
    {
        private readonly ISprintAplicacao _sprintAplicacao;

        public SprintController(ISprintAplicacao sprintAplicacao)
        {
            _sprintAplicacao = sprintAplicacao;
        }

        [HttpGet]
        [Route("Obter/{sprintId}")]
        public async Task<ActionResult> ObterAsync([FromRoute] int sprintId)
        {
            try
            {
                var sprintDominio = await _sprintAplicacao.ObterPorIdAsync(sprintId);
                return Ok(new SprintResposta(sprintDominio));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Criar")]
        public async Task<ActionResult> CriarAsync([FromBody] SprintCriar sprintCriar)
        {
            try
            {
                var sprint = new Sprint
                {
                    Nome = sprintCriar.Nome,
                    UsuarioId = sprintCriar.UsuarioId,
                    DataInicio = sprintCriar.DataInicio,
                    DataFim = sprintCriar.DataFim
                };

                var sptrinId = await _sprintAplicacao.CriarAsync(sprint);
                return Ok(sptrinId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<ActionResult> AtualizarAsync([FromBody] SprintAtualizar sprintAtualizar)
        {
            try
            {
                var sprint = new Sprint
                {
                    Id = sprintAtualizar.Id,
                    Nome = sprintAtualizar.Nome,
                    UsuarioId = sprintAtualizar.UsuarioId,
                    DataInicio = sprintAtualizar.DataInicio,
                    DataFim = sprintAtualizar.DataFim
                };

                await _sprintAplicacao.AtualizarAsync(sprint);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{sprintId}")]
        public async Task<ActionResult> DeletarAsync([FromRoute] int sprintId)
        {
            try
            {
                await _sprintAplicacao.DeletarAsync(sprintId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{sprintId}")]
        public async Task<ActionResult> RestaurarAsync([FromRoute] int sprintId)
        {
            try
            {
                await _sprintAplicacao.RestaurarAsync(sprintId);
                return Ok();
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
                var sprintsDominio = await _sprintAplicacao.ListarAsync(ativos);

                var sprints = sprintsDominio.Select(sprint => new SprintResposta(sprint)
                {
                    Id = sprint.Id,
                    Nome = sprint.Nome,
                    UsuarioId = sprint.UsuarioId,
                    DataInicio = sprint.DataInicio,
                    DataFim = sprint.DataFim
                }).ToList();

                return Ok(sprints);
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
                var sprintsDominio = await _sprintAplicacao.ListarPorUsuarioAsync(usuarioId, ativo);

                var sprints = sprintsDominio.Select(t => new SprintResposta(t)).ToList();

                return Ok(sprints);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
