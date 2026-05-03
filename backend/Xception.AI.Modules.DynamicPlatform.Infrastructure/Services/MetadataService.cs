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
    }
}
