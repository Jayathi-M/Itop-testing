using MediatR;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Domain.Entities;

namespace Xception.AI.Modules.DynamicPlatform.Application.Commands
{
    public record CreateColumnCommand(ColumnsEntity columnsEntity) : IRequest<ColumnsEntity>;
    
    public class CreateColumnCommandHandle(IColumnsRepository columnsRepository) : IRequestHandler<CreateColumnCommand, ColumnsEntity>
    {
        public async Task<ColumnsEntity> Handle(CreateColumnCommand request, CancellationToken cancellationToken)
        {

            return await columnsRepository.AddUpdateColumnAsync(request.columnsEntity.column_name, request.columnsEntity);
            //if (request.columnsEntity.id == 0)
            //{
            //    return await columnsRepository.AddColumnAsync(request.columnsEntity);
            //}
            //else
            //{
            //    return await columnsRepository.UpdateColumnAsync(request.columnsEntity.column_name, request.columnsEntity);
            //}
        }
    }
}
