using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class dynamicinti2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "field_name",
                schema: "core_schema",
                table: "columns",
                newName: "column_name");

            migrationBuilder.RenameColumn(
                name: "field_default_value",
                schema: "core_schema",
                table: "columns",
                newName: "column_default");

            migrationBuilder.RenameColumn(
                name: "char_max_len",
                schema: "core_schema",
                table: "columns",
                newName: "character_maximum_length");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "column_name",
                schema: "core_schema",
                table: "columns",
                newName: "field_name");

            migrationBuilder.RenameColumn(
                name: "column_default",
                schema: "core_schema",
                table: "columns",
                newName: "field_default_value");

            migrationBuilder.RenameColumn(
                name: "character_maximum_length",
                schema: "core_schema",
                table: "columns",
                newName: "char_max_len");
        }
    }
}
