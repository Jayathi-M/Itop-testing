using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Application.DTOs;

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Services
{
    public class MetadataService : IMetadataQueryService
    {
        private readonly string _connectionString;

        public MetadataService(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<List<TableInfoDto>> GetTablesAsync()
        {
            using var connection = new NpgsqlConnection(_connectionString);

            var sql = @"
            SELECT table_schema AS TableSchema,
                   table_name AS TableName
            FROM information_schema.tables
            WHERE table_schema NOT IN ('pg_catalog', 'information_schema','core_schema')
            ORDER BY table_schema, table_name;
        ";

            var result = await connection.QueryAsync<TableInfoDto>(sql);
            return result.ToList();
        }

        // UPDATED - now accepts List<CreateTableColumnDto>
        public async Task<bool> CreateTableAsync(string tableName, string tableSchema, List<CreateTableColumnDto> columns)
        {
            using var connection = new NpgsqlConnection(_connectionString);

            if (string.IsNullOrWhiteSpace(tableName) || string.IsNullOrWhiteSpace(tableSchema))
                throw new ArgumentException("Table name and schema are required.");

            var forbidden = new[] { ";", "--", "/*", "*/", "xp_", "'" };
            foreach (var f in forbidden)
            {
                if (tableName.Contains(f) || tableSchema.Contains(f))
                    throw new ArgumentException("Invalid characters in table name or schema.");
            }

            // Start with default columns
            var columnDefs = new List<string>
            {
                "id SERIAL PRIMARY KEY",
                "created_at TIMESTAMP DEFAULT NOW()"
            };

            // UPDATED - use col.Name and col.DataType
            if (columns != null && columns.Any())
            {
                foreach (var col in columns)
                {
                    if (!string.IsNullOrWhiteSpace(col.Name) && !forbidden.Any(f => col.Name.Contains(f)))
                    {
                        columnDefs.Add($"\"{col.Name.Trim()}\" {col.DataType}");
                    }
                }
            }

            var sql = $@"CREATE TABLE IF NOT EXISTS ""{tableSchema}"".""{tableName}"" (
                {string.Join(",\n                ", columnDefs)}
            );";

            await connection.ExecuteAsync(sql);
            return true;
        }
    }
}