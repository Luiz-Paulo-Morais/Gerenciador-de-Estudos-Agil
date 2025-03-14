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
            builder.Property(x => x.Concluida).HasColumnName("Concluida").IsRequired(true);
            builder.Property(x => x.MateriaId).HasColumnName("MateriaId").IsRequired(true);            
            builder.Property(x => x.Ativo).HasColumnName("Ativo").IsRequired(true);

            builder.HasOne(x => x.Materia)
                   .WithMany(m => m.Tarefas)
                   .HasForeignKey(x => x.MateriaId);
        }
    }
}
