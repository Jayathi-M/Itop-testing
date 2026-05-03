using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Infrastructure.DatabaseContext;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Domain.Entities;

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure.Repositories
{
   public class ColumnsRepository(AppDbContext appContext) : IColumnsRepository
   {

        public async Task<ColumnsEntity> AddUpdateColumnAsync(string colName, ColumnsEntity columnsType)
        {
            var columnsData = await appContext.Columns.FirstOrDefaultAsync(x => x.column_name == colName);
            if(columnsData is not null)
            {
                columnsData.table_schema = columnsType.table_schema;
                columnsData.table_name = columnsType.table_name;
                columnsData.column_name = columnsType.column_name;
                columnsData.column_default = columnsType.column_default;
                columnsData.is_nullable = columnsType.is_nullable;
                columnsData.data_type = columnsType.data_type;
                columnsData.character_maximum_length = columnsType.character_maximum_length;
                columnsData.numeric_precision = columnsType.numeric_precision;
                columnsData.numeric_scale = columnsType.numeric_scale;
                columnsData.label_name = columnsType.label_name;
                columnsData.lookup_table_name = columnsType.lookup_table_name;
                columnsData.lookup_text_field = columnsType.lookup_text_field;
                columnsData.lookup_value_field = columnsType.lookup_value_field;
                columnsData.lookup_filter = columnsType.lookup_filter;
                columnsData.is_active = columnsType.is_active;
                columnsData.is_dynamic = columnsType.is_dynamic;
                columnsData.is_displaylist = columnsType.is_displaylist;

                await appContext.SaveChangesAsync();

                return columnsData;
            }
            else
            {
                appContext.Columns.Add(columnsType);
                await appContext.SaveChangesAsync();
                return columnsType;
            }
        }

        /*
        public async Task<ColumnsEntity> AddColumnAsync(ColumnsEntity columnsType)
        {
            appContext.Columns.Add(columnsType);
            await appContext.SaveChangesAsync();
            return columnsType;
        }

        public async Task<ColumnsEntity> UpdateColumnAsync(string colName, ColumnsEntity columnsType)
        {
            var columnsData = await appContext.Columns.FirstOrDefaultAsync(x => x.column_name == colName);
            if (columnsData is null)
            {
                return null; // or throw exception
            }

            // Update fields
            columnsData.table_schema = columnsType.table_schema;
            columnsData.table_name = columnsType.table_name;
            columnsData.column_name = columnsType.column_name;
            columnsData.column_default = columnsType.column_default;
            columnsData.is_nullable = columnsType.is_nullable;
            columnsData.data_type = columnsType.data_type;
            columnsData.character_maximum_length = columnsType.character_maximum_length;
            columnsData.numeric_precision = columnsType.numeric_precision;
            columnsData.numeric_scale = columnsType.numeric_scale;
            columnsData.label_name = columnsType.label_name;
            columnsData.lookup_table_name = columnsType.lookup_table_name;
            columnsData.lookup_text_field = columnsType.lookup_text_field;
            columnsData.lookup_value_field = columnsType.lookup_value_field;
            columnsData.lookup_filter = columnsType.lookup_filter;
            columnsData.is_active = columnsType.is_active;
            columnsData.is_dynamic = columnsType.is_dynamic;
            columnsData.is_displaylist = columnsType.is_displaylist;

            await appContext.SaveChangesAsync();

            return columnsData;
        }
        */
    }
}
