using System;
using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using Systore.Dtos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.IO;

namespace Systore.Api.Controllers
{
    [Route("oapi")]
    public class AuthController : ControllerBase, IDisposable
    {
        private readonly IAuthService _authService;
        private IConfiguration _config;
      
        public AuthController(IAuthService authService, IConfiguration config)
        {
            _authService = authService;
            _config = config;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
        {
            try
            {
               
                var result = await _authService.Login(loginRequestDto);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        [HttpPost]
        [AllowAnonymous]
        [Route("validateToken")]
        public async Task<IActionResult> ValidateToken([FromBody] string token)
        {
            try
            {                
                var result = await Task.Run(() => _authService.ValidateToken(token));
                return Ok(result);
                /*return Ok(new LoginResponseDto()
                {
                    User = new UserLoginDto()
                    {
                        Admin = false,
                        UserName = "",
                    },
                    Token = "3214654s6a4d65as4f654sd6f46s",
                    Valid = true
                });*/
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }


        private bool _disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                Dispose(false);
            }
            _disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

    }
}