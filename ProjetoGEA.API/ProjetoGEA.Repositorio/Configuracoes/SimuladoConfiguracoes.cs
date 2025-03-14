using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio.Configuracoes
{
    public class SimuladoConfiguracoes : IEntityTypeConfiguration<Simulado>
    {
        public void Configure(EntityTypeBuilder<Simulado> builder)
        {
            builder.ToTable("Simulado").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasColumnName("SimuladoId");
            builder.Property(x => x.Nome).HasColumnName("Nome").IsRequired(true);
            builder.Property(x => x.DataAplicacao).HasColumnName("DataAplicacao").IsRequired(true);
            builder.Property(x => x.TotalAcertos).HasColumnName("TotalAcertos").IsRequired(true);
            builder.Property(x => x.TotalQuestoes).HasColumnName("TotalQuestoes").IsRequired(true);
            builder.Property(x => x.UsuarioId).HasColumnName("UsuarioId").IsRequired(true);
            builder.Property(x => x.MateriaId).HasColumnName("MateriaId").IsRequired(true);
            builder.Property(x => x.Ativo).HasColumnName("Ativo").IsRequired(true);

             builder.HasOne(x => x.Usuario)
                   .WithMany(u => u.Simulados)
                   .HasForeignKey(x => x.UsuarioId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Materia)
                   .WithMany(m => m.Simulados)
                   .HasForeignKey(x => x.MateriaId)
                   .OnDelete(DeleteBehavior.Restrict); 
        }
    }
}
