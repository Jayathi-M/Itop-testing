using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Application.DTOs;

namespace Xception.AI.Modules.DynamicPlatform.Application.Queries
{
    public class GetColumnsQuery : IRequest<List<ColumnsInfoDto>>
    {
        public string TableName { get; set; }
        public string TableSchema { get; set; }
        public GetColumnsQuery(string tableName,string tableschema)
        {
            TableName = tableName;
            TableSchema = tableschema;
        }
    }
    public class GetColumnsQueryHandler : IRequestHandler<GetColumnsQuery, List<ColumnsInfoDto>>
    {
        private readonly IColumnsdataQueryService _service;

        public GetColumnsQueryHandler(IColumnsdataQueryService service)
        {
            _service = service;
        }

        public async Task<List<ColumnsInfoDto>> Handle(GetColumnsQuery request, CancellationToken cancellationToken)
        {
            return await _service.GetColumnsAsync(request.TableName,request.TableSchema);
        }
    }
}
