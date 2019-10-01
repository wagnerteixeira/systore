using System;
using System.Collections.Generic;
using System.Text;
using Systore.Domain.Enums;

namespace Systore.Domain.Dtos
{
    public class AuditDto
    {
        public int Id { get; set; }
        public string TableName { get; set; }
        public DateTime Date { get; set; }
        public string UserName { get; set; }
        public string Operation { get; set; }
        public string FieldName { get; set; }
        public string PrimaryKey { get; set; }
        public string NewValue { get; set; }
    }
}
