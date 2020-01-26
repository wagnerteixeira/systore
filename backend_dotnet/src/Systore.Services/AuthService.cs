using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using System.Linq.Expressions;
using Systore.Dtos;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.Extensions.Options;
using Systore.Domain;

namespace Systore.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly AppSettings _appSettings;

        public AuthService(IUserRepository userRepository, IOptions<AppSettings> appSettings)
        {
            _userRepository = userRepository;
            _appSettings = appSettings.Value;
        }

        public LoginResponseDto ValidateToken(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            //var jsonToken = handler.ReadToken(token);
            //var tokenS = handler.ReadToken(_appSettings.Secret) as JwtSecurityToken;
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };

            var claims = handler.ValidateToken(token, validations, out var tokenSecure);

            var adminClaim = claims.Claims.Where(c => c.Type == "admin").FirstOrDefault();
            bool admin = false;
            if (adminClaim != null)
            {
                bool.TryParse(adminClaim.Value, out admin);
            }

            return new LoginResponseDto()
            {
                User = new UserLoginDto()
                {
                    Admin = admin,
                    UserName = claims.Identity.Name,
                },
                Token = token,
                Valid = true
            };
        }

        public async Task<LoginResponseDto> Login(LoginRequestDto loginRequestDto)
        {
            /*if (loginRequestDto.UserName.ToUpper() == "ADMIN" && loginRequestDto.Password== "Senha123")
            {
                return new LoginResponseDto()
                {
                    Valid = true,
                    Token = "systoretoken1234567890",
                    User = new UserLoginDto()
                    {
                        Admin = false,
                        UserName = "Admin"
                    }
                };
            };*/

            var user = await _userRepository.GetUserByUsernameAndPassword(loginRequestDto.UserName, loginRequestDto.Password);
            if (user != null)
            {
                // authentication successful so generate jwt token
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
                var claims = new Claim[]{
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim("admin", user.Admin.ToString())
                };
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return new LoginResponseDto()
                {
                    Valid = true,
                    Token = tokenHandler.WriteToken(token),
                    User = new UserLoginDto()
                    {
                        Admin = false,
                        UserName = user.UserName
                    }
                };
            }
            else
            {
                return new LoginResponseDto()
                {
                    Valid = false,
                    Relese = true
                };
            }
        }

    }
}