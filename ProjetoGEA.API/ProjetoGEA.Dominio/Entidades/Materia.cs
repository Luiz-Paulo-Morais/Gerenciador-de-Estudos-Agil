using System;
using System.Collections.Generic;

namespace ProjetoGEA.Dominio.Entidades
{
    public class Materia
    {
        public int Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
        public ICollection<Tarefa> Tarefas { get; set; }
        public bool Ativo { get; set; }

        // Relacionamento com Simulado
        public ICollection<Simulado> Simulados { get; set; } = new List<Simulado>();

        public Materia()
        {
            Ativo = true;
            Tarefas = new List<Tarefa>();
        }

        public void Deletar()
        {
            Ativo = false;
        }

        public void Restaurar()
        {
            Ativo = true;
        }
    }
}
