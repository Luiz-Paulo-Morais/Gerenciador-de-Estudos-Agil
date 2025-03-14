using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Api.Models.Materias.Requisicao;
using ProjetoGEA.Api.Models.Materias.Resposta;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MateriaController : ControllerBase
    {
        private readonly IMateriaAplicacao _materiaAplicacao;

        public MateriaController(IMateriaAplicacao materiaAplicacao)
        {
            _materiaAplicacao = materiaAplicacao;
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
                var materia = new Materia()
                {
                    Nome = materiaCriar.Nome,
                    Descricao = materiaCriar.Descricao,
                    UsuarioId = materiaCriar.UsuarioId
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
                var materia = new Materia()
                {
                    Id = materiaAtualizar.Id,
                    Nome = materiaAtualizar.Nome,
                    Descricao = materiaAtualizar.Descricao,
                };

                await _materiaAplicacao.AtualizarAsync(materia);
                return Ok();
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
                await _materiaAplicacao.DeletarAsync(materiaId);
                return Ok();
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
                await _materiaAplicacao.RestaurarAsync(materiaId);

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
                var materiasDominio = await _materiaAplicacao.ListarAsync(ativos);

                var materias = materiasDominio.Select(materia => new MateriaResposta(materia)
                {
                    Id = materia.Id,
                    Nome = materia.Nome,
                    Descricao = materia.Descricao,
                    UsuarioId = materia.UsuarioId
                }).ToList();

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
