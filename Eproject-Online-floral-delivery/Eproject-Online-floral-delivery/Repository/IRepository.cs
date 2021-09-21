using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Eproject_Online_floral_delivery.Repository
{
    interface IRepository<Tbl_Entity> where Tbl_Entity : class
    {
        //get all records
        IEnumerable<Tbl_Entity> GetAllRecords();
        //get all recoreds use IQueryable
        IQueryable<Tbl_Entity> GetAllRecordsIQueryable();
        //get number of records
        int GetAllRecordCount();
        //Add a record
        void Add(Tbl_Entity entity);
        //Update a record
        void Update(Tbl_Entity entity);
        //Update where clause
        void UpdateByWhereClause(Expression<Func<Tbl_Entity, bool>> wherePredict, Action<Tbl_Entity> ForEachPredict);
        //Get first or default records
        Tbl_Entity GetFirstorDefault(int recordId);
        //remove a record
        void Remove(Tbl_Entity entity);
        //Remove where clause
        void RemovebyWhereClause(Expression<Func<Tbl_Entity, bool>> wherePredict);
        //Remove Range where clause
        void RemoveRangeByWhereClause(Expression<Func<Tbl_Entity, bool>> wherePredict);
        void InactiveAndDeleteMarkByWhereClause(Expression<Func<Tbl_Entity, bool>> wherePredict, Action<Tbl_Entity> ForEachPredict);
        //Get First or Default By Parameter
        Tbl_Entity GetFirstorDefaultByParameter(Expression<Func<Tbl_Entity, bool>> wherePredict);
        //Get List records by Parameter
        IEnumerable<Tbl_Entity> GetListParameter(Expression<Func<Tbl_Entity, bool>> wherePredict);
        //Get Result By sqlProcedure
        IEnumerable<Tbl_Entity> GetResultBySqlprocedure(string query, params object[] parameters);
        //Get records to Show
        IEnumerable<Tbl_Entity> GetRecordToShow(int pageNo, int pageSize, Expression<Func<Tbl_Entity, bool>> wherePredict, Expression<Func<Tbl_Entity, int>> orderByPredict);
    }
}
