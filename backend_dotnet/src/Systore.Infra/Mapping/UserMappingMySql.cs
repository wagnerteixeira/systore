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
            builder.Property(p => p.UserName);
            builder.Property(p => p.Password);
            builder.Property(p => p.Admin);

            builder.HasData(
                new { Id = 1, UserName = "Admin", Password = "Senha123", Admin = true },
                new { Id = 2, UserName = "ROSE", Password = "1234", Admin = true },
                new { Id = 3, UserName = "IZAQUE", Password = "1234", Admin = true }
            );
        }
    }
}