using System;
using Microsoft.AspNetCore.Mvc;
using Systore.Domain.Entities;
using Systore.Domain.Abstractions;
using Systore.Dtos;

namespace Systore.Api.Controllers
{
  [Route("oapi")]  
  public class AuthController : ControllerBase, IDisposable 
  {

    [HttpPost]
    [Route("login")]
    public IActionResult Login([FromBody] LoginRequestDto loginRequestDto)
    {
      try
      {        
        return Ok(new LoginResponseDto(){
          User = new UserLoginDto(){
            Admin = loginRequestDto.UserName == "Admin" ? true : false,
            UserName = loginRequestDto.UserName
          },
          Token = "3214654s6a4d65as4f654sd6f46s"
        });
      }
      catch (Exception e)
      {
        return BadRequest(e);
      }
    }

    [HttpPost]
    [Route("validateToken")]
    public IActionResult ValidateToken([FromBody] ValidateTokenDto validateTokenDto)
    {
      try
      {        
        return Ok(new LoginResponseDto(){
          User = new UserLoginDto(){
            Admin = false,
            UserName = "",
          },
          Token = "3214654s6a4d65as4f654sd6f46s",
          Valid  = true
        });
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