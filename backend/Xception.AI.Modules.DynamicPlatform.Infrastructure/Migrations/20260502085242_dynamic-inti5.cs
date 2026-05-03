using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class dynamicinti5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "lable_name",
                schema: "core_schema",
                table: "columns",
                newName: "label_name");

            migrationBuilder.AddColumn<bool>(
                name: "is_displaylist",
                schema: "core_schema",
                table: "columns",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_displaylist",
                schema: "core_schema",
                table: "columns");

            migrationBuilder.RenameColumn(
                name: "label_name",
                schema: "core_schema",
                table: "columns",
                newName: "lable_name");
        }
    }
}
