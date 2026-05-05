using MediatR;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Application.DTOs;  // ADDED

namespace Xception.AI.Modules.DynamicPlatform.Application.Commands
{
    public record CreateDynamicTableCommand(string TableName, string TableSchema, List<CreateTableColumnDto> Columns) : IRequest<bool>;  // UPDATED

    public class CreateDynamicTableCommandHandler(IMetadataQueryService metadataService)
        : IRequestHandler<CreateDynamicTableCommand, bool>
    {
        public async Task<bool> Handle(CreateDynamicTableCommand request, CancellationToken cancellationToken)
        {
            return await metadataService.CreateTableAsync(request.TableName, request.TableSchema, request.Columns);
        }
    }
}