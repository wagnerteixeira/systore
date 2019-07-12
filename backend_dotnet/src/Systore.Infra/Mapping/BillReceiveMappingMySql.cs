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
      builder.Property(p => p.Id);
      builder.Property(p => p.Code);
      builder.Property(p => p.Quota);
      builder.Property(p => p.OriginalValue);
      builder.Property(p => p.Interest);
      builder.Property(p => p.FinalValue);
      builder.Property(p => p.PurchaseDate);
      builder.Property(p => p.DueDate);
      builder.Property(p => p.PayDate);
      builder.Property(p => p.DaysDelay);
      builder.Property(p => p.Situation);
      builder.Property(p => p.Vendor);


      builder
        .HasOne<Client>(s => s.Client)
        .WithMany(g => g.BillReceives)
        .HasForeignKey(s => s.ClientId)
        .OnDelete(DeleteBehavior.Restrict);

      builder
        .HasIndex(p => new {p.Code, p.Quota})
        .IsUnique();
    }
  }
}