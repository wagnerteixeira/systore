using Systore.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Systore.Infra.Mapping
{
    public class BillReceiveMappingMySql : IEntityTypeConfiguration<BillReceive>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<BillReceive> builder)
        {
            builder.HasKey(c => c.Id);

            builder.ToTable("BillReceive");

            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.Property(p => p.Code);

            builder.Property(p => p.Quota)
                .HasColumnType("SMALLINT");

            builder.Property(p => p.OriginalValue)
                .HasColumnType("DECIMAL(18, 2)");

            builder.Property(p => p.Interest)
                .HasColumnType("DECIMAL(18, 2)");

            builder.Property(p => p.FinalValue)
                .HasColumnType("DECIMAL(18, 2)");

            builder.Property(p => p.PurchaseDate);

            builder.Property(p => p.DueDate);

            builder.Property(p => p.PayDate);

            builder.Property(p => p.DaysDelay);

            builder.Property(p => p.Situation)
                .HasColumnType("TINYINT");

            builder.Property(p => p.Vendor)
                .HasMaxLength(30);


            builder
              .HasOne<Client>(s => s.Client)
              .WithMany(g => g.BillReceives)
              .HasForeignKey(s => s.ClientId)
              .OnDelete(DeleteBehavior.Restrict);
        }
    }
}