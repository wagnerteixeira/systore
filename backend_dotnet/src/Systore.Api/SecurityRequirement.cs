using Microsoft.OpenApi.Models;

namespace Systore.Api
{
    internal class SecurityRequirement : OpenApiSecurityRequirement
    {
        public SecuritySchemeType securyType { get; set; }
        public string token { get; set; }
    }
}