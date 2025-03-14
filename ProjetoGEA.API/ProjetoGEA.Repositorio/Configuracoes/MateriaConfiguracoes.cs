using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio.Configuracoes
{
    public class MateriaConfiguracoes : IEntityTypeConfiguration<Materia>
    {
        public void Configure(EntityTypeBuilder<Materia> builder)
        {
            builder.ToTable("Materia").HasKey(x => x.Id);

            builder.Property(x => x.Id).HasColumnName("MateriaId");
            builder.Property(x => x.Nome).HasColumnName("Nome").IsRequired(true);
            builder.Property(x => x.UsuarioId).HasColumnName("UsuarioId").IsRequired(true);
            builder.Property(x => x.Ativo).HasColumnName("Ativo").IsRequired(true);

            builder.HasOne(x => x.Usuario)
                   .WithMany(u => u.Materias)
                   .HasForeignKey(x => x.UsuarioId)
                   .OnDelete(DeleteBehavior.Restrict); // Evita exclusão em cascata

            // Novo relacionamento com Simulado
            builder.HasMany(x => x.Simulados)
                   .WithOne(s => s.Materia)
                   .HasForeignKey(s => s.MateriaId)
                   .OnDelete(DeleteBehavior.Restrict); // Evita problemas de cascata
        }
    }
}
