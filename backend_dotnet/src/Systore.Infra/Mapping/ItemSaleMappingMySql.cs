using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Systore.Infra.Mapping
{
    public class ItemSaleMappingMySql : IEntityTypeConfiguration<ItemSale>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<ItemSale> builder)
        {
            builder.HasKey(c => c.Id);

            builder.ToTable("itemsale");

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
              .WithMany(g => g.ItemSale)
              .HasForeignKey(s => s.SaleId)
              .OnDelete(DeleteBehavior.Cascade);

            builder
              .HasOne<Product>(s => s.Product)
              .WithMany(g => g.ItemSale)
              .HasForeignKey(s => s.ProductId)
              .OnDelete(DeleteBehavior.Restrict);

            
        }
    }
}