﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Systore.Infra.Context;

namespace Systore.Infra.Migrations.Audit
{
    [DbContext(typeof(AuditContext))]
    [Migration("20190809025404_InitialCreate")]
    partial class InitialCreate
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Systore.Domain.Entities.HeaderAudit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime");

                    b.Property<sbyte>("Operation")
                        .HasColumnType("TINYINT");

                    b.Property<string>("TableName")
                        .HasMaxLength(50);

                    b.Property<string>("UserName")
                        .HasMaxLength(30);

                    b.HasKey("Id");

                    b.ToTable("HeaderAudit");
                });

            modelBuilder.Entity("Systore.Domain.Entities.ItemAudit", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("FieldName")
                        .HasMaxLength(50);

                    b.Property<int>("HeaderAuditId");

                    b.Property<string>("NewValue");

                    b.Property<string>("OldValue");

                    b.HasKey("Id");

                    b.HasIndex("HeaderAuditId");

                    b.ToTable("ItemAudit");
                });

            modelBuilder.Entity("Systore.Domain.Entities.ItemAudit", b =>
                {
                    b.HasOne("Systore.Domain.Entities.HeaderAudit", "HeaderAudit")
                        .WithMany("ItemAudits")
                        .HasForeignKey("HeaderAuditId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
