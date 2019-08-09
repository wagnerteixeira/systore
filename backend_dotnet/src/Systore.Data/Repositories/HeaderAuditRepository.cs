using Systore.Domain.Entities;
using Systore.Data.Abstractions;
using Systore.Infra.Abstractions;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Systore.Infra.Context;
using System;
using Systore.Infra;
using Microsoft.Extensions.Options;
using Systore.Domain;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Systore.Data.Repositories
{
    public class HeaderAuditRepository : IHeaderAuditRepository
    {
        private static AuditContext _context = null;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DbSet<HeaderAudit> _entities;
        public HeaderAuditRepository(IOptions<AppSettings> options, IHttpContextAccessor httpContextAccessor)
        {            
            if (_context == null)
            {
                _context = new AuditContextFactory().CreateDbContext(options);
            }
            _httpContextAccessor = httpContextAccessor;
            _entities = _context.Instance.Set<HeaderAudit>();
        }

        public async Task<string> AddAsync(HeaderAudit entity)
        {
            var clainUserName = _httpContextAccessor.HttpContext.User.Claims.Where(c => c.Type == ClaimTypes.Name).FirstOrDefault();
            if (clainUserName != null)
                entity.UserName = clainUserName.Value;
            else
                entity.UserName = "User not identified";
            await _entities.AddAsync(entity);
            return await SaveChangesAsync();
        }

        protected virtual async Task<string> SaveChangesAsync()
        {
            try
            {
                await _context.Instance.SaveChangesAsync();
                return "";
            }
            /*
            catch (DbEntityValidationException erro)
            {
                string mensagem = "";
                foreach (DbEntityValidationResult entityvalidationErrors in erro.EntityValidationErrors)
                    foreach (DbValidationError validationError in entityvalidationErrors.ValidationErrors)
                        mensagem += string.Format("Entity: {0} \nProperty: {1} \nError: {2}\n\r", entityvalidationErrors.Entry, validationError.PropertyName, validationError.ErrorMessage);
                return mensagem;
            } */
            catch (Exception e)
            {
                if (e.InnerException != null)
                {
                    if (e.InnerException.InnerException != null)
                    {
                        Console.WriteLine(e.InnerException.InnerException.Message);
                        return e.InnerException.InnerException.Message;
                    }
                    else
                    {
                        Console.WriteLine(e.InnerException.Message);
                        return e.InnerException.Message;
                    }
                }
                else
                {
                    Console.WriteLine(e.Message);
                    return e.Message;
                }
            }
        }

    }
}
