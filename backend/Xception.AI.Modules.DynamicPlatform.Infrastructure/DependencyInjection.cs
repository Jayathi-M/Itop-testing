using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;
using Xception.AI.Modules.DynamicPlatform.Application.Commands.Interfaces;
using Xception.AI.Modules.DynamicPlatform.Infrastructure.DatabaseContext;
using Xception.AI.Modules.DynamicPlatform.Infrastructure.Repositories;
using Xception.AI.Modules.DynamicPlatform.Infrastructure.Services;

namespace Xception.AI.Modules.DynamicPlatform.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDynamicInfrastructureDI(this IServiceCollection services, IConfiguration configuration)
        {

            services.AddDbContext<AppDbContext>((serviceProvider, options) =>
            {
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));

            });

            // services.AddScoped<IColumnsRepository, ColumnsRepository>();
            services.AddScoped<IMetadataQueryService, MetadataService>();
            services.AddScoped<IColumnsdataQueryService, ColumnService>();
            services.AddScoped<IColumnsRepository, ColumnsRepository>();
            return services;
        }
    }
}
