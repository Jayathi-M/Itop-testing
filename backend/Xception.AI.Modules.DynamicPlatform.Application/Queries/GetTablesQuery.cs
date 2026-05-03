using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Application.DTOs;

namespace Xception.AI.Modules.DynamicPlatform.Application.Queries
{
    public class GetTablesQuery : IRequest<List<TableInfoDto>>
    {
    }
    public class GetTablesQueryHandler : IRequestHandler<GetTablesQuery, List<TableInfoDto>>
    {
        private readonly IMetadataQueryService _service;

        public GetTablesQueryHandler(IMetadataQueryService service)
        {
            _service = service;
        }

        public async Task<List<TableInfoDto>> Handle(GetTablesQuery request, CancellationToken cancellationToken)
        {
            return await _service.GetTablesAsync();
        }
    }
}
