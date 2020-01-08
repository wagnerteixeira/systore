using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Systore.Dtos
{
  public class UserLoginDto
  {
    public string UserName { get; set; }
    public bool Admin { get; set; }
  }
  public class LoginResponseDto
  {
    public UserLoginDto User { get; set; }
    public string Token { get; set; }
    public bool Valid { get; set; }
  }
}
