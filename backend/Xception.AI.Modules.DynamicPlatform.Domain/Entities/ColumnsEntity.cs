using System;
using System.Collections.Generic;
using System.Text;

namespace Xception.AI.Modules.DynamicPlatform.Domain.Entities
{
    public class ColumnsEntity
    {
        public int id { get; set; }
        public string table_schema { get; set; }
        public string table_name { get; set; }
        public string column_name { get; set; }
        public string column_default { get; set; }
        public string is_nullable { get; set; }
        public string data_type { get; set; }
        public int character_maximum_length { get; set; }
        public int numeric_precision { get; set; }
        public int numeric_scale { get; set; }
        public string label_name { get; set; }
        public string lookup_table_name { get; set; }
        public string lookup_text_field { get; set; }
        public string lookup_value_field { get; set; }
        public string lookup_filter { get; set; }
        public bool is_active { get; set; }
        public bool is_dynamic { get; set; }

        public bool is_displaylist { get; set; }
       
    }
}
