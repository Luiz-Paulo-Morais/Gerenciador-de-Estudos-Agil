using System.ComponentModel.DataAnnotations;

namespace ProjetoGEA.Dominio.Enumeradores
{
    public enum StatusTarefa
    {
        [Display(Name = "Pendente")]
        Pendente,

        [Display(Name = "Em Andamento")]
        EmAndamento,

        [Display(Name = "Concluída")]
        Concluida
    }
}