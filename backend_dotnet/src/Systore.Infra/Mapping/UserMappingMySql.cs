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
      builder.Property(p => p.Id);
      builder.Property(p => p.UserName);
      builder.Property(p=> p.Password);
      builder.Property(p => p.Admin);
    }
  }
}