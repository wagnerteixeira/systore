using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Systore.Infra.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Client",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(maxLength: 150, nullable: true),
                    RegistryDate = table.Column<DateTime>(nullable: true),
                    DateOfBirth = table.Column<DateTime>(nullable: true),
                    Address = table.Column<string>(maxLength: 150, nullable: true),
                    Neighborhood = table.Column<string>(maxLength: 50, nullable: true),
                    City = table.Column<string>(maxLength: 50, nullable: true),
                    State = table.Column<string>(maxLength: 50, nullable: true),
                    PostalCode = table.Column<string>(maxLength: 20, nullable: true),
                    Cpf = table.Column<string>(maxLength: 20, nullable: true),
                    Seller = table.Column<string>(maxLength: 30, nullable: true),
                    JobName = table.Column<string>(maxLength: 50, nullable: true),
                    Occupation = table.Column<string>(maxLength: 50, nullable: true),
                    PlaceOfBirth = table.Column<string>(maxLength: 50, nullable: true),
                    Spouse = table.Column<string>(maxLength: 150, nullable: true),
                    Note = table.Column<string>(nullable: true),
                    Phone1 = table.Column<string>(maxLength: 20, nullable: true),
                    Phone2 = table.Column<string>(maxLength: 20, nullable: true),
                    AddressNumber = table.Column<string>(maxLength: 20, nullable: true),
                    Rg = table.Column<string>(maxLength: 20, nullable: true),
                    Complement = table.Column<string>(maxLength: 50, nullable: true),
                    AdmissionDate = table.Column<DateTime>(nullable: true),
                    CivilStatus = table.Column<sbyte>(type: "TINYINT", nullable: false),
                    FatherName = table.Column<string>(maxLength: 150, nullable: true),
                    MotherName = table.Column<string>(maxLength: 150, nullable: true)
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
                    UserName = table.Column<string>(maxLength: 30, nullable: true),
                    Password = table.Column<string>(maxLength: 20, nullable: true),
                    Admin = table.Column<sbyte>(type: "TINYINT", nullable: false)
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
                    Quota = table.Column<short>(type: "SMALLINT", nullable: false),
                    OriginalValue = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    Interest = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    FinalValue = table.Column<decimal>(type: "DECIMAL(18, 2)", nullable: false),
                    PurchaseDate = table.Column<DateTime>(nullable: false),
                    DueDate = table.Column<DateTime>(nullable: false),
                    PayDate = table.Column<DateTime>(nullable: true),
                    DaysDelay = table.Column<int>(nullable: false),
                    Situation = table.Column<sbyte>(type: "TINYINT", nullable: false),
                    Vendor = table.Column<string>(maxLength: 30, nullable: true)
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

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Admin", "Password", "UserName" },
                values: new object[] { 1, (sbyte)1, "Senha123", "Admin" });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Admin", "Password", "UserName" },
                values: new object[] { 2, (sbyte)1, "1234", "ROSE" });

            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "Id", "Admin", "Password", "UserName" },
                values: new object[] { 3, (sbyte)1, "1234", "IZAQUE" });

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
