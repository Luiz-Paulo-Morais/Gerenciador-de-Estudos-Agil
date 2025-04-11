using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio.Configuracoes
{
    public class TarefaConfiguracoes : IEntityTypeConfiguration<Tarefa>
    {
        public void Configure(EntityTypeBuilder<Tarefa> builder)
        {
            builder.ToTable("Tarefa").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasColumnName("TarefaId");
            builder.Property(x => x.Titulo).HasColumnName("Titulo").IsRequired(true);
            builder.Property(x => x.Descricao).HasColumnName("Descricao").IsRequired(false);
            builder.Property(x => x.MateriaId).HasColumnName("MateriaId").IsRequired(true);
            builder.Property(x => x.SprintId).HasColumnName("SprintId").IsRequired(true);
            builder.Property(x => x.Status).HasColumnName("Status").IsRequired(true);
            builder.Property(x => x.Ativo).HasColumnName("Ativo").IsRequired(true);


            // Relacionamentos
            builder.HasOne(x => x.Materia)
                   .WithMany(m => m.Tarefas)
                   .HasForeignKey(x => x.MateriaId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Sprint)
                   .WithMany(s => s.Tarefas)
                   .HasForeignKey(x => x.SprintId)
                   .OnDelete(DeleteBehavior.Restrict);           
        }
    }
}
