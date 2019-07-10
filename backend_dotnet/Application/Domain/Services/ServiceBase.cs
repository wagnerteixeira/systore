using Application.Domain.Entities;
using Application.Domain.Services.Interfaces;
using Application.Infra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace Application.Domain.Services
{
    public abstract class ServiceBase<TEntity> : IDisposable, IServiceBase<TEntity> where TEntity : class
    {
        protected readonly Context _context;

        public ServiceBase(Context context)
        {
            this._context = context;
        }

        public string Add(TEntity entity)
        {
            _context.Set<TEntity>().Add(entity);
            return this.SaveChanges();
        }

        public TEntity Get(int id)
        {
            return _context.Set<TEntity>().Find(id);
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _context.Set<TEntity>().ToListAsync();
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _context.Set<TEntity>();
        }

        public string Update(TEntity entity)
        {
            try
            {
                var auxentity = _context.Entry(entity);
                _context.Update(auxentity);
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
                _context.Remove(entity);
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
                _context.SaveChanges();
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
            this._context.Dispose();
        }
    }
}
