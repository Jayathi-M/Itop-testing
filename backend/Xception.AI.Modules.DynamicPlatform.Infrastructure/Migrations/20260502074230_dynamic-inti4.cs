using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class dynamicinti4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "is_dynamic",
                schema: "core_schema",
                table: "columns",
                type: "boolean",
                nullable: false,
                defaultValue: true,
                oldClrType: typeof(bool),
                oldType: "boolean");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "is_dynamic",
                schema: "core_schema",
                table: "columns",
                type: "boolean",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldDefaultValue: true);
        }
    }
}
