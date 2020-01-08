using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Abstractions;

namespace Systore.Domain.Entities
{
    public class ItemAudit : IAudit
    {
        public int Id { get; set; }
        public int HeaderAuditId { get; set; }
        public string FieldName { get; set; }
        public string NewValue { get; set; }
        public string PrimaryKey { get; set; }
        public HeaderAudit HeaderAudit { get; set; }
    }
}
