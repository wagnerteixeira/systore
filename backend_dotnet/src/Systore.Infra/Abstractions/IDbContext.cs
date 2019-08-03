using System;
using Microsoft.EntityFrameworkCore;

namespace Systore.Infra.Abstractions
{
  public interface IDbContext : IDisposable
  {
    DbContext Instance { get; }
  }
}