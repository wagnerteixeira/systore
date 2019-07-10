using Application.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.Infra.Mapping
{
    public class PersonMappingMySql : IEntityTypeConfiguration<Person>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Person> builder)
        {
            builder.HasKey(c => c.Id);
            builder.ToTable("PESSOA");
            builder.Property(p => p.Id).HasColumnName("ID");
            builder.Property(p => p.Name).HasColumnName("NOME");
            builder.Property(p => p.Age).HasColumnName("IDADE");
        }
    }
}