using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Systore.Data.Abstractions;
using Systore.Data.Repositories;

namespace Systore.Api.Extensions
{
   
    public static class RepositoriesExtensions
    {
        public static IServiceCollection UseRepositories(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IClientRepository, ClientRepository>();
            services.AddScoped<IBillReceiveRepository, BillReceiveRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IHeaderAuditRepository, HeaderAuditRepository>();
            services.AddScoped<IItemAuditRepository, ItemAuditRepository>();
            services.AddScoped<ISaleRepository, SaleRepository>();
            services.AddScoped<IItemSaleRepository, ItemSaleRepository>();

            return services;
        }
    }
}
