using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Application.DTOs;

namespace Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces
{
    public interface IMetadataQueryService
    {
        Task<List<TableInfoDto>> GetTablesAsync();
    }
}

