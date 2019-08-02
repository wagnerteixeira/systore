using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Entities;

namespace Systore.Infra.Mapping
{
    public class ProductMapping : IEntityTypeConfiguration<Product>
    {


        public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Product> builder)
        {
            builder.HasKey(c => c.Id);

            builder.ToTable("Product");

            builder.Property(p => p.Id)
                .ValueGeneratedOnAdd();

            builder.Property(p => p.SaleType)
                .HasColumnType("TINYINT");

            builder.Property(p => p.Price)
                .HasColumnType("DECIMAL(18, 2)");

            builder.Property(p => p.ExpirationDays)
                .HasColumnType("SMALLINT");

            builder.Property(p => p.FirstDescription)
                .HasMaxLength(30);

            builder.Property(p => p.SecondDescription)
                .HasMaxLength(30);

            builder.Property(p => p.ThirdDescription)
                .HasMaxLength(30);

            builder.Property(p => p.PrintDateOfPackaging)
                .HasColumnType("TINYINT");

            builder.Property(p => p.PrintDateOfPackaging)
                .HasColumnType("TINYINT");

            builder.HasData(
                new { Id = 1, UserName = "Admin", Password = "Senha123", Admin = true },
                new { Id = 2, UserName = "ROSE", Password = "1234", Admin = true },
                new { Id = 3, UserName = "IZAQUE", Password = "1234", Admin = true }
            );
        }
    }
}
