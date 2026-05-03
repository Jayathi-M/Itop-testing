using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class dynamicinti3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_dynamic",
                schema: "core_schema",
                table: "columns",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_dynamic",
                schema: "core_schema",
                table: "columns");
        }
    }
}
