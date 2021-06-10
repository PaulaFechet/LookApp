using Microsoft.EntityFrameworkCore.Migrations;

namespace LookApp.Database.Migrations
{
    public partial class AddColorToCategory : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "GraphColor",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GraphColor",
                table: "Categories");
        }
    }
}
