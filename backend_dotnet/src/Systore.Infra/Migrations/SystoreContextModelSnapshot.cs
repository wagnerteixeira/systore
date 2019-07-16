﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Systore.Context.Infra;

namespace Systore.Infra.Migrations
{
    [DbContext(typeof(SystoreContext))]
    partial class SystoreContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("Systore.Domain.Entities.BillReceive", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ClientId");

                    b.Property<int>("Code");

                    b.Property<int>("DaysDelay");

                    b.Property<DateTime>("DueDate");

                    b.Property<double>("FinalValue");

                    b.Property<double>("Interest");

                    b.Property<double>("OriginalValue");

                    b.Property<DateTime>("PayDate");

                    b.Property<DateTime>("PurchaseDate");

                    b.Property<int>("Quota");

                    b.Property<int>("Situation");

                    b.Property<string>("Vendor");

                    b.HasKey("Id");

                    b.HasIndex("ClientId");

                    b.HasIndex("Code", "Quota")
                        .IsUnique();

                    b.ToTable("BillReceive");
                });

            modelBuilder.Entity("Systore.Domain.Entities.Client", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address");

                    b.Property<string>("AddressNumber");

                    b.Property<string>("AdmissionDate");

                    b.Property<string>("City");

                    b.Property<int>("CivilStatus");

                    b.Property<int>("Code");

                    b.Property<string>("Complement");

                    b.Property<string>("Cpf");

                    b.Property<DateTime>("DateOfBirth");

                    b.Property<string>("FatherName");

                    b.Property<string>("JobName");

                    b.Property<string>("MotherName");

                    b.Property<string>("Name");

                    b.Property<string>("Neighborhood");

                    b.Property<string>("Note");

                    b.Property<string>("Occupation");

                    b.Property<string>("Phone1");

                    b.Property<string>("Phone2");

                    b.Property<string>("PlaceOfBirth");

                    b.Property<string>("PostalCode");

                    b.Property<DateTime>("RegistryDate");

                    b.Property<string>("Rg");

                    b.Property<string>("Seller");

                    b.Property<string>("Spouse");

                    b.Property<string>("State");

                    b.HasKey("Id");

                    b.ToTable("Client");
                });

            modelBuilder.Entity("Systore.Domain.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Admin");

                    b.Property<string>("Password");

                    b.Property<string>("UserName");

                    b.HasKey("Id");

                    b.ToTable("User");
                });

            modelBuilder.Entity("Systore.Domain.Entities.BillReceive", b =>
                {
                    b.HasOne("Systore.Domain.Entities.Client", "Client")
                        .WithMany("BillReceives")
                        .HasForeignKey("ClientId")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}