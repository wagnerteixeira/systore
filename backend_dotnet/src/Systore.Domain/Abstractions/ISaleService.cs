using Systore.Domain.Entities;
using System.Threading.Tasks;

namespace Systore.Domain.Abstractions
{
  public interface ISaleService : IBaseService<Sale>
  {
        Sale GetSaleFullById(int id);


  }
}
