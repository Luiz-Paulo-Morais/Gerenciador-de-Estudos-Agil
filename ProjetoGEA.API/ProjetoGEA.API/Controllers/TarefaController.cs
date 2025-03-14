using Microsoft.AspNetCore.Mvc;
using ProjetoGEA.Api.Models.Tarefas.Requisicao;
using ProjetoGEA.Api.Models.Tarefas.Resposta;
using ProjetoGEA.Aplicacao;
using ProjetoGEA.Dominio.Entidades;

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
                    SprintId = tarefaAtualizar.SprintId
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

                var tarefas = tarefasDominio.Select(tarefa => new TarefaResposta(tarefa)
                {
                    Id = tarefa.Id,
                    Titulo = tarefa.Titulo,
                    Descricao = tarefa.Descricao,
                    DataCriacao = tarefa.DataCriacao,
                    Concluida = tarefa.Concluida,
                    MateriaId = tarefa.MateriaId,
                    SprintId = tarefa.SprintId
                }).ToList();

                return Ok(tarefas);
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
    }
}
