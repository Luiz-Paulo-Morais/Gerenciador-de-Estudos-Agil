using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Api.Models.CiclosPomodoro.Requisicao;
using ProjetoGEA.Api.Models.CiclosPomodoro.Resposta;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CicloPomodoroController : ControllerBase
    {
        private readonly ICicloPomodoroAplicacao _cicloPomodoroAplicacao;

        public CicloPomodoroController(ICicloPomodoroAplicacao cicloPomodoroAplicacao)
        {
            _cicloPomodoroAplicacao = cicloPomodoroAplicacao;
        }

        [HttpPost("Adicionar")]
        public async Task<ActionResult> AdicionarAsync(
            [FromBody] CicloPomodoroAdicionar cicloPomodoroAdicionar
        )
        {
            try
            {
                var cicloPomodoro = new CicloPomodoro(
                    cicloPomodoroAdicionar.UsuarioId,
                    cicloPomodoroAdicionar.MateriaId,
                    cicloPomodoroAdicionar.SprintId,
                    cicloPomodoroAdicionar.TarefaId,
                    cicloPomodoroAdicionar.Duracao,
                    cicloPomodoroAdicionar.DataRegistro
                );

                var cicloPomodoroId = await _cicloPomodoroAplicacao.AdicionarAsync(cicloPomodoro);

                return Ok(cicloPomodoroId);
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
                var ciclosPomodoDominio = await _cicloPomodoroAplicacao.ListarAsync(ativos);

                var ciclosPomodo = ciclosPomodoDominio
                    .Select(c => new CicloPomodoroResposta(c))
                    .ToList();

                return Ok(ciclosPomodo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorUsuario/{usuarioId}")]
        public async Task<ActionResult> ListarPorUsuarioAsync(
            [FromRoute] int usuarioId,
            [FromQuery] bool ativo
        )
        {
            try
            {
                var ciclosPomodoDominio = await _cicloPomodoroAplicacao.ListarPorUsuarioAsync(
                    usuarioId,
                    ativo
                );

                var ciclosPomodo = ciclosPomodoDominio
                    .Select(c => new CicloPomodoroResposta(c))
                    .ToList();

                return Ok(ciclosPomodo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorMateria/{materiaId}")]
        public async Task<ActionResult> ListarPorMateriaAsync(
            [FromRoute] int materiaId,
            [FromQuery] bool ativo
        )
        {
            try
            {
                var ciclosPomodoDominio = await _cicloPomodoroAplicacao.ListarPorMateriaAsync(
                    materiaId,
                    ativo
                );

                var ciclosPomodo = ciclosPomodoDominio
                    .Select(c => new CicloPomodoroResposta(c))
                    .ToList();

                return Ok(ciclosPomodo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorSprint/{sprintId}")]
        public async Task<ActionResult> ListarPorSprintAsync(
            [FromRoute] int sprintId,
            [FromQuery] bool ativo
        )
        {
            try
            {
                var ciclosPomodoDominio = await _cicloPomodoroAplicacao.ListarPorSprintAsync(
                    sprintId,
                    ativo
                );

                var ciclosPomodo = ciclosPomodoDominio
                    .Select(c => new CicloPomodoroResposta(c))
                    .ToList();

                return Ok(ciclosPomodo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("ListarPorTarefa/{tarefaId}")]
        public async Task<ActionResult> ListarPorTarefaAsync(
            [FromRoute] int tarefaId,
            [FromQuery] bool ativo
        )
        {
            try
            {
                var ciclosPomodoDominio = await _cicloPomodoroAplicacao.ListarPorTarefaAsync(
                    tarefaId,
                    ativo
                );

                var ciclosPomodo = ciclosPomodoDominio
                    .Select(c => new CicloPomodoroResposta(c))
                    .ToList();

                return Ok(ciclosPomodo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{cicloPomodoroId}")]
        public async Task<ActionResult> DeletarAsync([FromRoute] int cicloPomodoroId)
        {
            try
            {
                await _cicloPomodoroAplicacao.DeletarAsync(cicloPomodoroId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("tarefas/concluidas/horas")]
        public async Task<IActionResult> ObterHorasPorTarefaConcluidaAsync(
            DateTime? inicio = null,
            DateTime? fim = null
        )
        {
            try
            {
                var resultado = await _cicloPomodoroAplicacao.ObterHorasPorTarefaConcluidaAsync(
                    inicio,
                    fim
                );
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("materias/horas")]
        public async Task<IActionResult> ObterHorasPorMateriaComTarefasConcluidasAsync(
            DateTime? inicio = null,
            DateTime? fim = null
        )
        {
            try
            {
                var resultado =
                    await _cicloPomodoroAplicacao.ObterHorasPorMateriaComTarefasConcluidasAsync(
                        inicio,
                        fim
                    );
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("sprints/horas")]
        public async Task<IActionResult> ObterHorasPorSprintAsync(
            DateTime? inicio = null,
            DateTime? fim = null
        )
        {
            try
            {
                var resultado = await _cicloPomodoroAplicacao.ObterHorasPorSprintAsync(inicio, fim);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPatch("concluir/{cicloPomodoroId}/{novaDuracao}")]
        public async Task<IActionResult> ConcluirCicloAsync(
            [FromRoute] int cicloPomodoroId,
            int novaDuracao
        ) // novaDuracao em segundos
        {
            try
            {
                // Converte segundos para minutos inteiros (arredonda para cima)
                int duracaoEmMinutos = (int)Math.Ceiling(novaDuracao / 60.0);

                await _cicloPomodoroAplicacao.ConcluirCicloAsync(cicloPomodoroId, duracaoEmMinutos);
                return Ok("Ciclo concluído com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest($"Erro ao concluir ciclo: {ex.Message}");
            }
        }
    }
}
