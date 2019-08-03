using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Systore.Infra.Abstractions;
using Systore.Domain.Entities;
using Systore.Data.Abstractions;


namespace Systore.Data.Repositories
{
    public abstract class BaseRepository<TEntity> : IDisposable, IBaseRepository<TEntity> where TEntity : class
    {
        protected readonly IDbContext _context;

        public BaseRepository(IDbContext context)
        {
            this._context = context;
        }

        public string Add(TEntity entity)
        {
            _context.Instance.Set<TEntity>().Add(entity);
            return this.SaveChanges();
        }

        public TEntity Get(int id)
        {
            return _context.Instance.Set<TEntity>().Find(id);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _context.Instance.Set<TEntity>().ToListAsync();
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _context.Instance.Set<TEntity>();
        }

        public string Update(TEntity entity)
        {
            try
            {
                var auxentity = _context.Instance.Entry(entity);
                _context.Instance.Update(auxentity);
                return this.SaveChanges();
            }
            catch
            {
                return "Error while updating.";
            }
        }

        public string Remove(int Id)
        {
            try
            {
                var entity = Get(Id);
                _context.Instance.Remove(entity);
                return this.SaveChanges();

            }
            catch
            {
                return "Error while deleting.";
            }

        }


        protected string SaveChanges()
        {
            try
            {
                this._context.Instance.SaveChanges();
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
                        return e.InnerException.InnerException.Message;
                    else
                        return e.InnerException.Message;
                }
                else
                    return e.Message;
            }
        }

        public void Dispose()
        {
            
        }
    }
}
