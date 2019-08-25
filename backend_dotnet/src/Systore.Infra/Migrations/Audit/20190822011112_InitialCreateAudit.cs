using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Systore.Infra.Migrations.Audit
{
    public partial class InitialCreateAudit : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HeaderAudit",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    TableName = table.Column<string>(maxLength: 50, nullable: true),
                    Date = table.Column<DateTime>(type: "datetime", nullable: false),
                    UserName = table.Column<string>(maxLength: 30, nullable: true),
                    Operation = table.Column<sbyte>(type: "TINYINT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeaderAudit", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ItemAudit",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    HeaderAuditId = table.Column<int>(nullable: false),
                    FieldName = table.Column<string>(maxLength: 50, nullable: true),
                    OldValue = table.Column<string>(nullable: true),
                    NewValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemAudit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ItemAudit_HeaderAudit_HeaderAuditId",
                        column: x => x.HeaderAuditId,
                        principalTable: "HeaderAudit",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemAudit_HeaderAuditId",
                table: "ItemAudit",
                column: "HeaderAuditId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemAudit");

            migrationBuilder.DropTable(
                name: "HeaderAudit");
        }
    }
}
