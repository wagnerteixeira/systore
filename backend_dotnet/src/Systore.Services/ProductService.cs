using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Threading.Tasks;
using System.Collections.Generic;
using Systore.Domain.Dtos;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.Extensions.Logging;

namespace Systore.Services
{
    public class ProductService : BaseService<Product>, IProductService
    {
        public ProductService(IProductRepository repository) : base(repository)
        {
        }

        public Task<List<Product>> GetProductsForExportToBalance(FilterProductsToBalance filterProductsToBalance)
        {
            return (_repository as IProductRepository).GetProductsForExportToBalance(filterProductsToBalance);
        }

        public async Task<string> GenerateFileItensToBalance(int[] productsId)
        {
            var productsToExport = await (_repository as IProductRepository).GetAll().Where(c => productsId.Any(pid => pid == c.Id)).ToListAsync();
            List<string> fileToExport = new List<string>();
            int departamentId = 1;
            foreach(var product in productsToExport)
            {
                
                fileToExport.Add($"PRODUTO {product.Id} {product.FirstDescription}");
            }
            return string.Join(Environment.NewLine, fileToExport.ToArray());
        }

        public async Task<string> GenerateFileInfoToBalance(int[] productsId)
        {
            var productsToExport = await (_repository as IProductRepository).GetAll().Where(c => productsId.Any(pid => pid == c.Id)).ToListAsync();
            List<string> fileToExport = new List<string>();
            int departamentId = 1;
            foreach (var product in productsToExport)
            {

                fileToExport.Add($"PRODUTO {product.Id} {product.FirstDescription}");
            }
            return string.Join(Environment.NewLine, fileToExport.ToArray());
        }
    }
}
