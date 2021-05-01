using Microsoft.EntityFrameworkCore.Migrations;

namespace LookApp.Database.Migrations
{
    public partial class ReplaceTypeWithUnitOfMeasureAndRange : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Categories",
                newName: "UnitOfMeasure");

            migrationBuilder.AddColumn<double>(
                name: "LowerLimit",
                table: "Categories",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "UpperLimit",
                table: "Categories",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LowerLimit",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "UpperLimit",
                table: "Categories");

            migrationBuilder.RenameColumn(
                name: "UnitOfMeasure",
                table: "Categories",
                newName: "Type");
        }
    }
}
