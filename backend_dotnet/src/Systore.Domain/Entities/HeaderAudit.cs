using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Abstractions;
using Systore.Domain.Enums;

namespace Systore.Domain.Entities
{
    public class HeaderAudit : IAudit
    {
        public HeaderAudit()
        {
            this.ItemAudits = new HashSet<ItemAudit>();
        }

        public int Id { get; set; }
        public string TableName { get; set; }
        public DateTime Date { get; set; }
        public string UserName { get; set; }
        public AuditOperation Operation { get; set; }

        public ICollection<ItemAudit> ItemAudits { get; set; }        
    }
}
