using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio.Configuracoes
{
    public class SprintConfiguracoes : IEntityTypeConfiguration<Sprint>
    {
        public void Configure(EntityTypeBuilder<Sprint> builder)
        {
            builder.ToTable("Sprint").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasColumnName("SprintId");
            builder.Property(x => x.Nome).HasColumnName("Nome").IsRequired(true);
            builder.Property(x => x.DataInicio).HasColumnName("DataInicio").IsRequired(true);
            builder.Property(x => x.DataFim).HasColumnName("DataFim").IsRequired(true);
            builder.Property(x => x.UsuarioId).HasColumnName("UsuarioId").IsRequired(true);
            builder.Property(x => x.Ativo).HasColumnName("Ativo").IsRequired(true);

            builder.HasOne(x => x.Usuario)
                   .WithMany(u => u.Sprints)
                   .HasForeignKey(x => x.UsuarioId);
        }
    }
}
