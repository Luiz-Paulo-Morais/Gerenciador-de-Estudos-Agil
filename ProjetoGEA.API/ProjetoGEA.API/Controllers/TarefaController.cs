using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Api.Models.Tarefas.Requisicao;
using ProjetoGEA.Api.Models.Tarefas.Resposta;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Dominio.Enumeradores;
using System.ComponentModel.DataAnnotations;

namespace ProjetoGEA.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TarefaController : ControllerBase
    {
        private readonly ITarefaAplicacao _tarefaAplicacao;

        public TarefaController(ITarefaAplicacao tarefaAplicacao)
        {
            _tarefaAplicacao = tarefaAplicacao;
        }

        [HttpGet]
        [Route("Obter/{tarefaId}")]
        public async Task<ActionResult> ObterAsync([FromRoute] int tarefaId)
        {
            try
            {
                var tarefaDominio = await _tarefaAplicacao.ObterPorIdAsync(tarefaId);
                return Ok(new TarefaResposta(tarefaDominio));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ObterUsuarioId/{tarefaId}")]
        public async Task<IActionResult> ObterUsuarioIdPorTarefaAsync(int tarefaId)
        {
            try
            {
                var usuarioId = await _tarefaAplicacao.ObterUsuarioIdPorTarefaAsync(tarefaId);

                if (usuarioId == null)
                    return NotFound(new { mensagem = "Usuário não encontrado para esta tarefa." });

                return Ok(new { usuarioId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { mensagem = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro interno no servidor.", erro = ex.Message });
            }
        }


        [HttpPost]
        [Route("Criar")]
        public async Task<ActionResult> CriarAsync([FromBody] TarefaCriar tarefaCriar)
        {
            try
            {
                var tarefa = new Tarefa
                {
                    Titulo = tarefaCriar.Titulo,
                    Descricao = tarefaCriar.Descricao,
                    MateriaId = tarefaCriar.MateriaId,
                    SprintId = tarefaCriar.SprintId
                };

                var tarefaId = await _tarefaAplicacao.CriarAsync(tarefa);
                return Ok(tarefaId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<ActionResult> AtualizarAsync([FromBody] TarefaAtualizar tarefaAtualizar)
        {
            try
            {
                var tarefa = new Tarefa
                {
                    Id = tarefaAtualizar.Id,
                    Titulo = tarefaAtualizar.Titulo,
                    Descricao = tarefaAtualizar.Descricao,
                    MateriaId = tarefaAtualizar.MateriaId,
                    SprintId = tarefaAtualizar.SprintId,
                    Status = tarefaAtualizar.Status
                };

                await _tarefaAplicacao.AtualizarAsync(tarefa);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{tarefaId}")]
        public async Task<ActionResult> DeletarAsync([FromRoute] int tarefaId)
        {
            try
            {
                await _tarefaAplicacao.DeletarAsync(tarefaId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{tarefaId}")]
        public async Task<ActionResult> RestaurarAsync([FromRoute] int tarefaId)
        {
            try
            {
                await _tarefaAplicacao.RestaurarAsync(tarefaId);
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
                var tarefasDominio = await _tarefaAplicacao.ListarAsync(ativos);

                if (!tarefasDominio.Any())
                    return NotFound("Nenhuma tarefa encontrada.");

                var tarefas = tarefasDominio.Select(tarefa => new TarefaResposta(tarefa)).ToList();

                return Ok(tarefas);
            }
            catch (Exception)
            {
                return StatusCode(500, "Erro interno ao listar tarefas.");
            }
        }


        [HttpGet]
        [Route("ListarPorUsuario/{usuarioId}")]
        public async Task<ActionResult> ListarPorUsuarioAsync([FromRoute] int usuarioId, [FromQuery] bool ativo)
        {
            try
            {
                var tarefasDominio = await _tarefaAplicacao.ListarPorUsuarioAsync(usuarioId, ativo);

                var tarefas = tarefasDominio.Select(t => new TarefaResposta(t)).ToList();

                return Ok(tarefas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorMateria/{materiaId}")]
        public async Task<ActionResult> ListarPorMateriaAsync([FromRoute] int materiaId, [FromQuery] bool ativo)
        {
            try
            {
                var tarefasDominio = await _tarefaAplicacao.ListarPorMateriaAsync(materiaId, ativo);

                var tarefas = tarefasDominio.Select(t => new TarefaResposta(t)).ToList();

                return Ok(tarefas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorSprint/{sprintId}")]
        public async Task<ActionResult> ListarPorSprintAsync([FromRoute] int sprintId, [FromQuery] bool ativo)
        {
            try
            {
                var tarefasDominio = await _tarefaAplicacao.ListarPorSprintAsync(sprintId, ativo);

                var tarefas = tarefasDominio.Select(t => new TarefaResposta(t)).ToList();

                return Ok(tarefas);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ListarStatusTarefa")]
        public ActionResult ListarStatusTarefaAsync()
        {
            try
            {
                var statusTarefa = Enum.GetValues(typeof(StatusTarefa))
                    .Cast<StatusTarefa>()
                    .Select(tipo => new StatusTarefaResposta
                    {
                        Id = (int)tipo,
                        Nome = tipo.GetType()
                                .GetField(tipo.ToString())
                                .GetCustomAttributes(typeof(DisplayAttribute), false)
                                .Cast<DisplayAttribute>()
                                .FirstOrDefault()?.Name ?? tipo.ToString()
                    })
                    .ToList();

                return Ok(statusTarefa);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
