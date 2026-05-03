using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Application.DTOs;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Services
{
    public class ColumnService : IColumnsdataQueryService
    {
        private readonly string _connectionString;

        public ColumnService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<ColumnsInfoDto>> GetColumnsAsync(string tableName,string tableschema)
        {
            using var connection = new NpgsqlConnection(_connectionString);
            if (string.IsNullOrWhiteSpace(tableName))
                throw new ArgumentException("Table name is required");
            if (string.IsNullOrWhiteSpace(tableschema))
                throw new ArgumentException("Table schema is required");

            var sql = @"SELECT 
            isc.table_schema,
            isc.table_name,
            isc.column_name,
            isc.column_default,
            isc.is_nullable,
            isc.data_type,
            isc.character_maximum_length,
            isc.numeric_precision,
            isc.numeric_scale,
            COALESCE(csc.label_name,'') as label_name,
            csc.lookup_table_name,
            csc.lookup_text_field,
            csc.lookup_value_field,
            csc.lookup_filter,
           True AS is_active,
           False AS is_dynamic,
           False AS is_displaylist
        FROM information_schema.columns isc
        LEFT JOIN core_schema.columns csc 
        ON isc.table_name = csc.table_name
        AND isc.table_schema=csc.table_schema
        AND isc.column_name=csc.column_name
        AND csc.is_dynamic=false
        WHERE isc.table_name = @TableName
        And isc.table_schema = @TableSchema
        
    union
            SELECT 
            col.table_schema,
            col.table_name,
            col.column_name,
            col.column_default,
            col.is_nullable,
            col.data_type,
            col.character_maximum_length,
            col.numeric_precision,
            col.numeric_scale,
            col.label_name,
            col.lookup_table_name,
            col.lookup_text_field,
            col.lookup_value_field,
            col.lookup_filter,
            col.is_active,
            col.is_dynamic,
            col.is_displaylist
        FROM core_schema.columns col
        WHERE col.table_name = @TableName
        And col.table_schema = @TableSchema
        And col.is_dynamic=true
    ";

            var result = await connection.QueryAsync<ColumnsInfoDto>(sql, new { TableName = tableName, TableSchema = tableschema});
            return result.ToList();
            //c.table_schema = 'core_schema'
            /*LEFT JOIN core_schema.columns t
            ON c.table_name = t.table_name
           AND c.column_name = t.field_name*/
        }
    }
}
