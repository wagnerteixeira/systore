using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Systore.Infra.Mapping
{
    public class SaleMappingMySql : IEntityTypeConfiguration<Sale>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Sale> builder)
        {
            builder.HasKey(c => c.Id);

            builder.ToTable("Sale");

            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.Property(p => p.Vendor)
                .HasMaxLength(30);

            builder.Property(p => p.SaleDate);

            builder.Property(p => p.FinalValue)
                .HasColumnType("DECIMAL(18, 2)");

            builder
              .HasOne<Client>(s => s.Client)
              .WithMany(g => g.Sales)
              .HasForeignKey(s => s.ClientId)
              .OnDelete(DeleteBehavior.Restrict);
           

        }
    }
}