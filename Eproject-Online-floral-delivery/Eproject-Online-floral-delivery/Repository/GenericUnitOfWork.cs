using Eproject_Online_floral_delivery.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Eproject_Online_floral_delivery.Repository
{
    class GenericUnitOfWork : IDisposable
    {
        private Eproject_FloralEntities DBEntity = new Eproject_FloralEntities();
        public IRepository<Tbl_EntityType> GetRepositoryInstance<Tbl_EntityType>() where Tbl_EntityType : class
        {
            return new GenericRespository<Tbl_EntityType>(DBEntity);
        }

        public void SaveChanges()
        {
            DBEntity.SaveChanges();
        }

        protected virtual void Dispose(bool disposing)
        {
            if(!this.disposed)
            {
                if (disposing)
                {
                    DBEntity.Dispose();
                }
            }
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        private bool disposed = false;
    }
}