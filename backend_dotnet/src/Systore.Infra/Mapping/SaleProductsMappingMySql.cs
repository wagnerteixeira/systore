using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Systore.Infra.Mapping
{
    public class SaleProductsMappingMySql : IEntityTypeConfiguration<SaleProducts>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<SaleProducts> builder)
        {
            builder.HasKey(c => c.Id);

            builder.ToTable("SaleProducts");

            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.Property(p => p.Price)
                .HasColumnType("DECIMAL(18, 2)");

            builder.Property(p => p.TotalPrice)
                .HasColumnType("DECIMAL(18, 2)");

            builder.Property(p => p.Quantity)
                .HasColumnType("DECIMAL(18, 2)");

            builder
              .HasOne<Sale>(s => s.Sale)
              .WithMany(g => g.SaleProducts)
              .HasForeignKey(s => s.SaleId)
              .OnDelete(DeleteBehavior.Restrict);

            builder
              .HasOne<Product>(s => s.Product)
              .WithMany(g => g.SaleProducts)
              .HasForeignKey(s => s.ProductId)
              .OnDelete(DeleteBehavior.Restrict);

        }
    }
}