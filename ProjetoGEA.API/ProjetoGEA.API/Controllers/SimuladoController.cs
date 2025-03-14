using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Api.Models.Simulados.Requisicao;
using ProjetoGEA.Api.Models.Simulados.Resposta;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProjetoGEA.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SimuladoController : ControllerBase
    {
        private readonly ISimuladoAplicacao _simuladoAplicacao;

        public SimuladoController(ISimuladoAplicacao simuladoAplicacao)
        {
            _simuladoAplicacao = simuladoAplicacao;
        }

        [HttpGet("Obter/{simuladoId}")]
        public async Task<ActionResult> ObterPorIdAsync([FromRoute] int simuladoId)
        {
            try
            {
                var simuladoDominio = await _simuladoAplicacao.ObterPorIdAsync(simuladoId);

                return Ok(new SimuladoResposta(simuladoDominio));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Criar")]
        public async Task<ActionResult> CriarAsync([FromBody] SimuladoCriar simuladoCriar)
        {
            try
            {
                var simulado = new Simulado(
                        simuladoCriar.Nome,
                        simuladoCriar.DataAplicacao,
                        simuladoCriar.UsuarioId,
                        simuladoCriar.MateriaId,
                        simuladoCriar.TotalQuestoes,
                        simuladoCriar.TotalAcertos
                     );

                var simuladoId = await _simuladoAplicacao.CriarAsync(simulado);

                return Ok(simuladoId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<ActionResult> AtualizarAsync([FromBody] SimuladoAtualizar simuladoAtualizar)
        {
            try
            {
                // Obtém o simulado existente para garantir que ele está no banco
                var simuladoDominio = await _simuladoAplicacao.ObterPorIdAsync(simuladoAtualizar.Id);
                if (simuladoDominio == null)
                {
                    return NotFound("Simulado não encontrado.");
                }

                // Atualiza os dados do simulado
                simuladoDominio.AtualizarDados(
                    simuladoAtualizar.Nome,
                    simuladoAtualizar.DataAplicacao,
                    simuladoAtualizar.UsuarioId,
                    simuladoAtualizar.MateriaId,
                    simuladoAtualizar.TotalQuestoes,
                    simuladoAtualizar.TotalAcertos
                );

                // Chama o método de atualização da aplicação
                await _simuladoAplicacao.AtualizarAsync(simuladoDominio);

                return Ok("Simulado atualizado com sucesso.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("Deletar/{simuladoId}")]
        public async Task<ActionResult> DeletarAsync([FromRoute] int simuladoId)
        {
            try
            {
                await _simuladoAplicacao.DeletarAsync(simuladoId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Restaurar/{simuladoId}")]
        public async Task<ActionResult> RestaurarAsync([FromRoute] int simuladoId)
        {
            try
            {
                await _simuladoAplicacao.RestaurarAsync(simuladoId);
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
                var simuladosDominio = await _simuladoAplicacao.ListarAsync(ativos);

                var simulados = simuladosDominio.Select(s => new SimuladoResposta(s)).ToList();

                return Ok(simulados);
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
                var simuladosDominio = await _simuladoAplicacao.ListarPorUsuarioAsync(usuarioId, ativo);

                var simulados = simuladosDominio.Select(s => new SimuladoResposta(s)).ToList();

                return Ok(simulados);
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
                var simuladosDominio = await _simuladoAplicacao.ListarPorMateriaAsync(materiaId, ativo);

                var simulados = simuladosDominio.Select(s => new SimuladoResposta(s)).ToList();

                return Ok(simulados);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
