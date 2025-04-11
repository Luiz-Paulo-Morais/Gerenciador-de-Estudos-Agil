using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio.Configuracoes
{
   public class MetaEstudoConfiguracoes : IEntityTypeConfiguration<MetaEstudo>
    {
        public void Configure(EntityTypeBuilder<MetaEstudo> builder)
        {       
            builder.ToTable("MetaEstudo").HasKey(x => x.Id);
            builder.Property(x => x.Id).HasColumnName("MetaEstudoId");            
            builder.Property(x => x.UsuarioId).HasColumnName("UsuarioId").IsRequired(true);
            builder.Property(x => x.SprintId).HasColumnName("SprintId").IsRequired(true);
            builder.Property(x => x.MateriaId).HasColumnName("MateriaId").IsRequired(true);            
            builder.Property(x => x.HorasPlanejadas).HasColumnName("HorasPlanejadas").IsRequired(true);            
            builder.Property(x => x.Ativo).HasColumnName("Ativo").IsRequired(true);

            
            builder.HasOne(x => x.Usuario)
                   .WithMany(u => u.MetasEstudo)
                   .HasForeignKey(x => x.UsuarioId)
                   .OnDelete(DeleteBehavior.Restrict);

            
            builder.HasOne(x => x.Materia)
                   .WithMany(m => m.MetasEstudo)
                   .HasForeignKey(x => x.MateriaId)
                   .OnDelete(DeleteBehavior.Restrict);

            
            builder.HasOne(x => x.Sprint)
                   .WithMany(s => s.MetasEstudo)
                   .HasForeignKey(x => x.SprintId)
                   .OnDelete(DeleteBehavior.Restrict);
            
        }
    }
}
