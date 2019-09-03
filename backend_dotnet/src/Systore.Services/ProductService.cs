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
using System.Text;

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

        public async Task<string> GenerateFileContentItensToBalance(int[] productsId)
        {
            var productsToExport = await (_repository as IProductRepository).GetAll().Where(c => productsId.Any(pid => pid == c.Id)).ToListAsync();
            List<string> fileToExport = new List<string>();            
            foreach(var product in productsToExport)
            {
                var line = new StringBuilder()
                    .Append(1.StringFormat(2))//codigo do departamento
                    .Append(((int)product.SaleType).StringFormat(1))//tipo de venda
                    .Append(product.Id.StringFormat(6))//codigo do item
                    .Append(product.Price.StringFormat(6))//preço
                    .Append(product.ExpirationDays.StringFormat(3))//dias de validade
                    .Append(product.Description.StringFormat(25))//descrição
                    .Append("".StringFormat(25))//segunda descrição
                    .Append(product.Id.StringFormat(6))//codigo da informação extra
                    .Append(0.StringFormat(4))//codigo da imagem
                    .Append(0.StringFormat(6))//codigo da informação nuticional
                    .Append(product.PrintExpirationDate ? "1" : "0")//imprime data de validade
                    .Append(product.PrintDateOfPackaging ? "1" : "0")//imprime data de ebalagem
                    .Append(0.StringFormat(4))//codigo do fornecedor
                    .Append(0.StringFormat(12))//lote
                    .Append(0.StringFormat(11))//codigo ean 13 especial
                    .Append("1")//versão do preço
                    .Append(0.StringFormat(4))//codigo do som
                    .Append(0.StringFormat(4))//codigo de tara pre determinada
                    .Append(0.StringFormat(4))//codigo do fracionador
                    .Append(0.StringFormat(4))//codigo do campo extra 1
                    .Append(0.StringFormat(4))//codigo do campo extra 2
                    .Append(0.StringFormat(4))//codigo da conservação
                    .Append(0.StringFormat(12))//ean 13 de fornecedor
                    .Append(0.StringFormat(6))//percentual de glaceamento
                    .Append("|01|")//sequencia de departamentos associados
                    .Append("".StringFormat(35))//terceira descrição
                    .Append("".StringFormat(35))//quarta descrição
                    .Append(0.StringFormat(6))//codigo do campo extra 3
                    .Append(0.StringFormat(6))//codigo do campo extra 4
                    .Append(0.StringFormat(6))//codigo da midia
                    .Append(0.StringFormat(7))//desconhecido
                    .Append("||0||")//desconhecido
                    .ToString();

                fileToExport.Add(line);
            }
            return string.Join(Environment.NewLine, fileToExport.ToArray());
        }
        public async  Task<string> GenerateFileContentInfoToBalance(int[] productsId)
        {
            var productsToExport = await (_repository as IProductRepository).GetAll().Where(c => productsId.Any(pid => pid == c.Id)).ToListAsync();
            List<string> fileToExport = new List<string>();
            foreach (var product in productsToExport)
            {
                var line = new StringBuilder()
                    .Append(product.Id.StringFormat(6))//codigo do item
                    .Append("".StringFormat(100))//espaço vazio
                    .Append(product.FirstDescription.StringFormat(56))//primeira descrição
                    .Append(product.SecondDescription.StringFormat(56))//segunda descrição
                    .Append(product.ThirdDescription.StringFormat(56))//terceira descrição
                    .Append("".StringFormat(952))//espaço vazio                    
                    .ToString();

                fileToExport.Add(line);
            }
            return string.Join(Environment.NewLine, fileToExport.ToArray());
        }
       
    }
}
