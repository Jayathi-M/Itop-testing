using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Xception.AI.Modules.DynamicPlatform.Application.Commands;
using Xception.AI.Modules.DynamicPlatform.Application.DTOs;
using Xception.AI.Modules.DynamicPlatform.Application.Queries;
using Xception.AI.Modules.DynamicPlatform.Domain.Entities;

namespace Xception.AI.Modules.DynamicPlatform.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TableMasterController(ISender sender) : ControllerBase
    {

        [HttpGet("tables")]
        public async Task<IActionResult> GetTablesAsync()
        {
            var result = await sender.Send(new GetTablesQuery());
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetColumnsAsync(string tableName, string tableschema)
        {
            var result = await sender.Send(new GetColumnsQuery(tableName, tableschema));
            return Ok(result);
        }

        [HttpPost("create-columns")]
        public async Task<IActionResult> AddColumnsAsync([FromBody] ColumnsEntity columnsEntity)
        {
            var result = await sender.Send(new CreateColumnCommand(columnsEntity));
            return Ok(result);
        }

        [HttpPost("create-table")]
        public async Task<IActionResult> CreateTableAsync([FromBody] CreateTableRequestDto request)
        {
            var result = await sender.Send(new CreateDynamicTableCommand(request.TableName, request.TableSchema, request.Columns));  // UPDATED
            return Ok(result);
        }

    }
}