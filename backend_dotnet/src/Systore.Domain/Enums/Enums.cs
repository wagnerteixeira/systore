using System;
using System.Collections.Generic;
using System.Text;

namespace Systore.Domain.Enums
{
    public enum CivilStatus
    {
        NotMarried,
        Married,
        Divorced,
        Separete,
        Widower
    }

    public enum BillReceiveSituation
    {
        Open,
        Closed
    }

    public enum Operation
    {
        Eq,
        Gt,
        Gte,
        Lt,
        Lte,
        Con,
        StW,
        EnW
    }

    public enum Order
    {
        Asc,
        Desc
    }

    public enum SaleType
    {
        Unit,
        Weight
    }

    public enum AuditOperation
    {
        Add,
        Update,
        Remove
    }

    public enum TypeOfSearchProductsToBalance
    {
        OnlyModified,
        All
    }

}
