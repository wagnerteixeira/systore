using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using System;

namespace Systore.Api.Controllers
{
    [Route("api/[controller]")]
    public class ProductController : BaseController<Product>
    {
        public ProductController(IProductService Service)
            : base(Service)
        {

        }
    }
}