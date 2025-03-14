public abstract class BaseRepositorio
{
    protected readonly ProjetoGEAContexto _contexto;

    protected BaseRepositorio(ProjetoGEAContexto contexto)
    {
        _contexto = contexto;
    }
}