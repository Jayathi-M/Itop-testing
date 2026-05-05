namespace Xception.AI.Modules.DynamicPlatform.Application.DTOs
{
    public class CreateTableColumnDto
    {
        public string Name { get; set; }
        public string DataType { get; set; } = "TEXT";
    }

    public class CreateTableRequestDto
    {
        public string TableName { get; set; }
        public string TableSchema { get; set; } = "UMS";
        public List<CreateTableColumnDto> Columns { get; set; } = new();  // UPDATED
    }
}