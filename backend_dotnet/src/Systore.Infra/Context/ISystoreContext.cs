using System;
using System.Collections.Generic;
using System.Text;
using Systore.Infra.Abstractions;
using Microsoft.EntityFrameworkCore;
using Systore.Domain.Entities;

namespace Systore.Context.Infra
{
  public interface ISystoreContext : IDbContext
  {
    DbSet<User> Users { get; set; }
  }
}
