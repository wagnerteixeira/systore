using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Systore.Infra.Mapping
{
  public class ClientMappingMySql : IEntityTypeConfiguration<Client>
  {
    public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Client> builder)
    {
      builder.HasKey(c => c.Id);
      builder.ToTable("Client");
      builder.Property(p => p.Id);
      builder.Property(p => p.Name);
      builder.Property(p => p.Code);
      builder.Property(p => p.RegistryDate);
      builder.Property(p => p.DateOfBirth);
      builder.Property(p => p.Address);
      builder.Property(p => p.Neighborhood);
      builder.Property(p => p.City);
      builder.Property(p => p.State);
      builder.Property(p => p.PostalCode);
      builder.Property(p => p.Cpf);
      builder.Property(p => p.Seller);
      builder.Property(p => p.JobName);
      builder.Property(p => p.Occupation);
      builder.Property(p => p.PlaceOfBirth);
      builder.Property(p => p.Spouse);
      builder.Property(p => p.Note);
      builder.Property(p => p.Phone1);
      builder.Property(p => p.Phone2);
      builder.Property(p => p.AddressNumber);
      builder.Property(p => p.Rg);
      builder.Property(p => p.Complement);
      builder.Property(p => p.AdmissionDate);
      builder.Property(p => p.CivilStatus);
      builder.Property(p => p.FatherName);
      builder.Property(p => p.MotherName);
    }
  }
}