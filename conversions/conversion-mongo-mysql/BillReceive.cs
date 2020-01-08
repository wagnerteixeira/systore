using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace conversion_mongo_mysql.Models
{

  [BsonIgnoreExtraElements]
  public class BillReceive
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string client { get; set; }
    public int code { get; set; } //Código
    public int quota { get; set; }//Parcela

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal original_value { get; set; } //Valor original

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal interest { get; set; } // juros

    [BsonRepresentation(BsonType.Decimal128)]
    public decimal final_value { get; set; } //Valor pago
    public DateTime? purchase_date { get; set; }//Data da venda
    public DateTime? due_date { get; set; }//Data de vencimento
    public DateTime? pay_date { get; set; }//Data de pagamento
    public int days_delay { get; set; } // Dias atraso
    public string situation { get; set; }
    public string vendor { get; set; } // Vendedor

  }
}