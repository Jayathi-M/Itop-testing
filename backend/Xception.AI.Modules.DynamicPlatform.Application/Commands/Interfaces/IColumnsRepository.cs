using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Domain.Entities;

namespace Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces
{
    public interface IColumnsRepository
    {
        // Task<IEnumerable<MasterTypeEntity>> GetAllMasterTypesAsync();
        // Task<ColumnsEntity> AddColumnAsync(ColumnsEntity columnType);
        // Task<ColumnsEntity> UpdateColumnAsync(string colName, ColumnsEntity columnType);
        Task<ColumnsEntity> AddUpdateColumnAsync(string colName, ColumnsEntity columnType);
    }
}
