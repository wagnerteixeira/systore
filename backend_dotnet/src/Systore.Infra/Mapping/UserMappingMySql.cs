using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Systore.Infra.Mapping
{
    public class UserMappingMySql : IEntityTypeConfiguration<User>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<User> builder)
        {
            builder.HasKey(c => c.Id);
            builder.ToTable("User");
            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.Property(p => p.UserName)
                .HasMaxLength(30);

            builder.Property(p => p.Password)
                .HasMaxLength(20);

            builder.Property(p => p.Admin)
                .HasColumnType("TINYINT");

            builder.HasData(
                new { Id = 1, UserName = "Admin", Password = "Senha123", Admin = true }
            );
        }
    }
}