using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio.Configuracoes
{
    public class CicloPomodoroConfiguracoes : IEntityTypeConfiguration<CicloPomodoro>
    {
        public void Configure(EntityTypeBuilder<CicloPomodoro> builder)
        {
            builder.ToTable("CicloPomodoro").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasColumnName("CicloPomodoroId");            
            builder.Property(x => x.UsuarioId).HasColumnName("UsuarioId").IsRequired(true);
            builder.Property(x => x.MateriaId).HasColumnName("MateriaId").IsRequired(true);
            builder.Property(x => x.SprintId).HasColumnName("SprintId").IsRequired(true);
            builder.Property(x => x.TarefaId).HasColumnName("TarefaId").IsRequired(false);
            builder.Property(x => x.Duracao).HasColumnName("Duracao").IsRequired(true);
            builder.Property(x => x.DataRegistro).HasColumnName("DataRegistro").IsRequired(true);
            builder.Property(x => x.FinalizadoEm).HasColumnType("datetime").HasColumnName("FinalizadoEm").IsRequired(false);
            builder.Property(x => x.Ativo).HasColumnName("Ativo").IsRequired(true);

            // Correção: Relacionamento correto com Usuario
            builder.HasOne(x => x.Usuario)
                   .WithMany(u => u.CiclosPomodoro)
                   .HasForeignKey(x => x.UsuarioId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Correção: Relacionamento correto com Materia
            builder.HasOne(x => x.Materia)
                   .WithMany(m => m.CiclosPomodoro)
                   .HasForeignKey(x => x.MateriaId)
                   .OnDelete(DeleteBehavior.Restrict);

            // Correção: Adicionando relacionamento com Sprint
            builder.HasOne(x => x.Sprint)
                   .WithMany(s => s.CiclosPomodoro)
                   .HasForeignKey(x => x.SprintId)
                   .OnDelete(DeleteBehavior.Restrict); 

            // Correção: Adicionando relacionamento com Tarefa
            builder.HasOne(x => x.Tarefa)
                   .WithMany(t => t.CiclosPomodoro)
                   .HasForeignKey(x => x.TarefaId)
                   .OnDelete(DeleteBehavior.Restrict);                   
        }
    }
}
