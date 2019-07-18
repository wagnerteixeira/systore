using System;
using System.Collections.Generic;
using Systore.Domain.Enums;

namespace Systore.Domain.Entities
{
  public class ClientDto
  {    
    public int Id { get; set; }
    public string Name { get; set; }
    //public int Code { get; set; }
    public DateTime? RegistryDate { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string Address { get; set; }
    public string Neighborhood { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string PostalCode { get; set; }
    public string Cpf { get; set; }
    public string Seller { get; set; }
    public string JobName { get; set; }
    public string Occupation { get; set; }
    public string PlaceOfBirth { get; set; }
    public string Spouse { get; set; }
    public string Note { get; set; }
    public string Phone1 { get; set; }
    public string Phone2 { get; set; }
    public string AddressNumber { get; set; }
    public string Rg { get; set; }
    public string Complement { get; set; }
    public DateTime? AdmissionDate { get; set; }
    public CivilStatus CivilStatus { get; set; }
    public string FatherName { get; set; }
    public string MotherName { get; set; }
    public ICollection<BillReceive> BillReceives { get; set; }
  }
}
