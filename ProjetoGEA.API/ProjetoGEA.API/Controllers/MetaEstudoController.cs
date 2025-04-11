using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Api.Models.MetasEstudo.Requisicao;
using ProjetoGEA.Api.Models.MetasEstudo.Resposta;

namespace ProjetoGEA.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MetaEstudoController : ControllerBase
    {
        private readonly IMetaEstudoAplicacao _metaEstudoAplicacao;

        public MetaEstudoController(IMetaEstudoAplicacao metaEstudoAplicacao)
        {
            _metaEstudoAplicacao = metaEstudoAplicacao;
        }

        [HttpPost("Adicionar")]
        public async Task<ActionResult> AdicionarAsync([FromBody] MetaEstudoAdicionar metaEstudoAdicionar)
        {
            try
            {
                var metaEstudo = new MetaEstudo(
                        metaEstudoAdicionar.UsuarioId,
                        metaEstudoAdicionar.SprintId,
                        metaEstudoAdicionar.MateriaId,
                        //metaEstudoAdicionar.TarefaId,
                        metaEstudoAdicionar.HorasPlanejadas
                     );
                Console.WriteLine($"🔍 SprintId recebido: {metaEstudo.SprintId}");
                var metaEstudoId = await _metaEstudoAplicacao.AdicionarAsync(metaEstudo);

                return Ok(metaEstudoId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Obter/{metaEstudoId}")]
        public async Task<ActionResult> ObterPorIdAsync([FromRoute] int metaEstudoId)
        {
            try
            {
                var metaEstudoDominio = await _metaEstudoAplicacao.ObterPorIdAsync(metaEstudoId);

                return Ok(new MetaEstudoResposta(metaEstudoDominio));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("Atualizar")]
        public async Task<ActionResult> AtualizarAsync([FromBody] MetaEstudoAtualizar metaEstudoAtualizar)
        {
            try
            {
                // Verifica se o ID do metaEstudoAtualizar é válido
                var metaEstudoDominio = await _metaEstudoAplicacao.ObterPorIdAsync(metaEstudoAtualizar.Id);
                if (metaEstudoDominio == null)
                {
                    return NotFound("Meta de Estudo não encontrada.");
                }

                // Atualiza os dados do metaEstudoDominio
                metaEstudoDominio.UsuarioId = metaEstudoAtualizar.UsuarioId;
                metaEstudoDominio.SprintId = metaEstudoAtualizar.SprintId;
                metaEstudoDominio.MateriaId = metaEstudoAtualizar.MateriaId;
                //metaEstudoDominio.TarefaId = metaEstudoAtualizar.TarefaId;
                metaEstudoDominio.HorasPlanejadas = metaEstudoAtualizar.HorasPlanejadas;

                
                await _metaEstudoAplicacao.AtualizarAsync(metaEstudoDominio);

                return Ok("Meta de Estudo atualizada com sucesso.");
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
                var metasEstudoDominio = await _metaEstudoAplicacao.ListarPorUsuarioAsync(usuarioId, ativo);

                var metasEstudo = metasEstudoDominio.Select(c => new MetaEstudoResposta(c)).ToList();

                return Ok(metasEstudo);
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
                var metasEstudoDominio = await _metaEstudoAplicacao.ListarPorMateriaAsync(materiaId, ativo);

                var metasEstudo = metasEstudoDominio.Select(c => new MetaEstudoResposta(c)).ToList();

                return Ok(metasEstudo);
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
                var metasEstudoDominio = await _metaEstudoAplicacao.ListarPorSprintAsync(sprintId, ativo);

                var metasEstudo = metasEstudoDominio.Select(c => new MetaEstudoResposta(c)).ToList();

                return Ok(metasEstudo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // [HttpGet]
        // [Route("ListarPorTarefa/{tarefaId}")]
        // public async Task<ActionResult> ListarPorTarefaAsync([FromRoute] int tarefaId, [FromQuery] bool ativo)
        // {
        //     try
        //     {
        //         var metasEstudoDominio = await _metaEstudoAplicacao.ListarPorTarefaAsync(tarefaId, ativo);

        //         var metasEstudo = metasEstudoDominio.Select(c => new MetaEstudoResposta(c)).ToList();

        //         return Ok(metasEstudo);
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(ex.Message);
        //     }
        // }

        [HttpDelete]
        [Route("Deletar/{metaEstudoId}")]
        public async Task<ActionResult> DeletarAsync([FromRoute] int metaEstudoId)
        {
            try
            {
                await _metaEstudoAplicacao.DeletarAsync(metaEstudoId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
