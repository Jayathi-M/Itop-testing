using Xception.AI.Modules.DynamicPlatform.Application;
using Xception.AI.Modules.DynamicPlatform.Infrastructure;

namespace Xception.AI.Modules.DynamicPlatform.API
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddDynamicAPIDI(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDynamicApplicationDI()
                    .AddDynamicInfrastructureDI(configuration);

            return services;
        }
    }
}
