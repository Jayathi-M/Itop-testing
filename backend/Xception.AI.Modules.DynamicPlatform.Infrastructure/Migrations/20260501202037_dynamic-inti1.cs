using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class dynamicinti1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "core_schema");

            migrationBuilder.CreateTable(
                name: "columns",
                schema: "core_schema",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityAlwaysColumn),
                    table_schema = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    table_name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    field_name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    field_default_value = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false, defaultValueSql: "100"),
                    is_nullable = table.Column<string>(type: "character varying(5)", maxLength: 5, nullable: false),
                    data_type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    char_max_len = table.Column<int>(type: "integer", nullable: false),
                    numeric_precision = table.Column<int>(type: "integer", nullable: false),
                    numeric_scale = table.Column<int>(type: "integer", nullable: false),
                    lable_name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    lookup_table_name = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    lookup_text_field = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    lookup_value_field = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    lookup_filter = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_columns", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "columns",
                schema: "core_schema");
        }
    }
}
