using Microsoft.OpenApi.Models;

namespace Systore.Api
{
    internal class ApiKeyScheme : OpenApiSecurityScheme
    {
        public string Description { get; set; }
        public string Name { get; set; }
        public ParameterLocation In { get; set; }
        public string Type { get; set; }
    }
}