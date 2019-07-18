using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Systore.Infra.Migrations
{
    public partial class initialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Client",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    RegistryDate = table.Column<DateTime>(nullable: true),
                    DateOfBirth = table.Column<DateTime>(nullable: true),
                    Address = table.Column<string>(nullable: true),
                    Neighborhood = table.Column<string>(nullable: true),
                    City = table.Column<string>(nullable: true),
                    State = table.Column<string>(nullable: true),
                    PostalCode = table.Column<string>(nullable: true),
                    Cpf = table.Column<string>(nullable: true),
                    Seller = table.Column<string>(nullable: true),
                    JobName = table.Column<string>(nullable: true),
                    Occupation = table.Column<string>(nullable: true),
                    PlaceOfBirth = table.Column<string>(nullable: true),
                    Spouse = table.Column<string>(nullable: true),
                    Note = table.Column<string>(nullable: true),
                    Phone1 = table.Column<string>(nullable: true),
                    Phone2 = table.Column<string>(nullable: true),
                    AddressNumber = table.Column<string>(nullable: true),
                    Rg = table.Column<string>(nullable: true),
                    Complement = table.Column<string>(nullable: true),
                    AdmissionDate = table.Column<DateTime>(nullable: true),
                    CivilStatus = table.Column<int>(nullable: false),
                    FatherName = table.Column<string>(nullable: true),
                    MotherName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Client", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    UserName = table.Column<string>(nullable: true),
                    Password = table.Column<string>(nullable: true),
                    Admin = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BillReceive",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    ClientId = table.Column<int>(nullable: false),
                    Code = table.Column<int>(nullable: false),
                    Quota = table.Column<int>(nullable: false),
                    OriginalValue = table.Column<decimal>(nullable: false),
                    Interest = table.Column<decimal>(nullable: false),
                    FinalValue = table.Column<decimal>(nullable: false),
                    PurchaseDate = table.Column<DateTime>(nullable: false),
                    DueDate = table.Column<DateTime>(nullable: false),
                    PayDate = table.Column<DateTime>(nullable: true),
                    DaysDelay = table.Column<int>(nullable: false),
                    Situation = table.Column<int>(nullable: false),
                    Vendor = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillReceive", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BillReceive_Client_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Client",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BillReceive_ClientId",
                table: "BillReceive",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_BillReceive_Code_Quota",
                table: "BillReceive",
                columns: new[] { "Code", "Quota" },
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BillReceive");

            migrationBuilder.DropTable(
                name: "User");

            migrationBuilder.DropTable(
                name: "Client");
        }
    }
}
