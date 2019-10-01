using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Entities;

namespace Systore.Infra.Mapping
{

    public class ItemAuditMappingMySql : IEntityTypeConfiguration<ItemAudit>
    {
        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<ItemAudit> builder)
        {
            builder.HasKey(c => c.Id);
            builder.ToTable("ItemAudit");

            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.Property(p => p.HeaderAuditId);

            builder.Property(p => p.FieldName)
                .HasMaxLength(50);

            builder.Property(p => p.PrimaryKey)
                .HasMaxLength(50);

            builder.Property(p => p.NewValue);

            builder.HasOne<HeaderAudit>(s => s.HeaderAudit)
                .WithMany(g => g.ItemAudits)
                .HasForeignKey(s => s.HeaderAuditId);
        }
    }
}
