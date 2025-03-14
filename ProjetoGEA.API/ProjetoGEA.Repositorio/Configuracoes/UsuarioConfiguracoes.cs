using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProjetoGEA.Dominio.Entidades;

namespace ProjetoGEA.Repositorio.Configuracoes
{
    public class UsuarioConfiguracoes : IEntityTypeConfiguration<Usuario>
    {
        public void Configure(EntityTypeBuilder<Usuario> builder)
        {
            builder.ToTable("Usuario").HasKey(x => x.Id);

            builder.Property(nameof(Usuario.Id)).HasColumnName("UsuarioId");
            builder.Property(nameof(Usuario.Nome)).HasColumnName("Nome").IsRequired(true);
            builder.Property(nameof(Usuario.Email)).HasColumnName("Email").IsRequired(true);
            builder.Property(nameof(Usuario.SenhaHash)).HasColumnName("Senha").IsRequired(true);
            builder.Property(nameof(Usuario.DataCriacao)).HasColumnName("DataCriacao").IsRequired(true);
            builder.Property(nameof(Usuario.Ativo)).HasColumnName("Ativo").IsRequired(true);
        }
    }
}

