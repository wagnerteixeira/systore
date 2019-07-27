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

namespace Systore.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        public AuthService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
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
                return new LoginResponseDto()
                {
                    Valid = true,
                    Token = "systoretoken1234567890",
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
                };
            }
        }
    }
}