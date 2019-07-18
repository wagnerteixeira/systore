using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace conversion_mongo_mysql.Models
{

  [BsonIgnoreExtraElements]
  public class Client
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string name { get; set; } //Nome
    public int code { get; set; }  //Id no sistema antigo
    public DateTime? registry_date { get; set; } //Data de inclusão
    public DateTime? date_of_birth { get; set; } //Data de aniversário
    public string address { get; set; } //Endereço
    public string neighborhood { get; set; } // Bairro
    public string city { get; set; } //Cidade
    public string state { get; set; } //Estado
    public string postal_code { get; set; } //Cep
    public string cpf { get; set; } //Cpf
    public string seller { get; set; } //Vendedor
    public string job_name { get; set; } //Nome da empresa de trabalho
    public string occupation { get; set; } //Profissão
    public string place_of_birth { get; set; } //Naturalidade
    public string spouse { get; set; } //Cônjuge
    public string note { get; set; } //Observações
    public string phone1 { get; set; } //Telefone 1
    public string phone2 { get; set; } //Telefone 2
    public string address_number { get; set; } //Número do endereço
    public string rg { get; set; } // rg
    public string complement { get; set; } // complemento
    public DateTime? admission_date { get; set; }//Data de admissao
    public int civil_status { get; set; }
    public string father_name { get; set; } // Nome do pai
    public string mother_name { get; set; } // Nome da mae


  }
}