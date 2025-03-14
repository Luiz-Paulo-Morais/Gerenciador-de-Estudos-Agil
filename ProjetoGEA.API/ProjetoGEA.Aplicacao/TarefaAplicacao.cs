using ProjetoGEA.Dominio.Entidades;
using ProjetoGEA.Repositorio;

namespace ProjetoGEA.Aplicacao
{
    public class TarefaAplicacao : ITarefaAplicacao
    {
        private readonly ITarefaRepositorio _tarefaRepositorio;

        public TarefaAplicacao(ITarefaRepositorio tarefaRepositorio)
        {
            _tarefaRepositorio = tarefaRepositorio;
        }

        public async Task<int> CriarAsync(Tarefa tarefa)
        {
            if (tarefa == null)
            {
                throw new Exception("Tarefa não pode ser vazia");
            }

            return await _tarefaRepositorio.CriarAsync(tarefa);
        }

        public async Task AtualizarAsync(Tarefa tarefa)
        {
            var tarefaDominio = await _tarefaRepositorio.ObterPorIdAsync(tarefa.Id);
            if (tarefaDominio == null)
            {
                throw new Exception("Tarefa não encontrada");
            }

            tarefaDominio.Titulo = tarefa.Titulo;
            tarefaDominio.Descricao = tarefa.Descricao;
            tarefaDominio.MateriaId = tarefa.MateriaId;
            tarefaDominio.SprintId = tarefa.SprintId;
            tarefaDominio.Concluida = tarefa.Concluida;
            

            await _tarefaRepositorio.AtualizarAsync(tarefaDominio);
        }

        public async Task DeletarAsync(int tarefaId)
        {
            var tarefaDominio = await _tarefaRepositorio.ObterPorIdAsync(tarefaId);
            if (tarefaDominio == null)
            {
                throw new Exception("Tarefa não encontrada");
            }

            tarefaDominio.Deletar();
            await _tarefaRepositorio.AtualizarAsync(tarefaDominio);
        }

        public async Task RestaurarAsync(int tarefaId)
        {
            var tarefaDominio = await _tarefaRepositorio.ObterDesativoAsync(tarefaId);
            if (tarefaDominio == null)
            {
                throw new Exception("Tarefa não encontrada");
            }

            tarefaDominio.Restaurar();
            await _tarefaRepositorio.AtualizarAsync(tarefaDominio);
        }

        public async Task<Tarefa> ObterPorIdAsync(int tarefaId)
        {
            return await _tarefaRepositorio.ObterPorIdAsync(tarefaId)
                ?? throw new Exception("Tarefa não encontrada");
        }

        public async Task<IEnumerable<Tarefa>> ListarPorMateriaAsync(int materiaId, bool ativo)
        {
            return await _tarefaRepositorio.ListarPorMateriaAsync(materiaId, ativo);
        }

        public async Task<IEnumerable<Tarefa>> ListarPorUsuarioAsync(int usuarioId, bool ativo)
        {
            return await _tarefaRepositorio.ListarPorUsuarioAsync(usuarioId, ativo);
        }
        public async Task<IEnumerable<Tarefa>> ListarAsync(bool ativo)
        {
            return await _tarefaRepositorio.ListarAsync(ativo);
        }
    }
}
