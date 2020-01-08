using conversion_mongo_mysql;
using conversion_mongo_mysql.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace check_conversion_mongo_mysql
{
    public static class Extensions
    {
        public static string GetSituationString(this Systore.Domain.Enums.BillReceiveSituation billReceiveSituation)
        {
            return (billReceiveSituation == Systore.Domain.Enums.BillReceiveSituation.Open ? "O" : "C");
        }

        public static bool IsEqual(this BillReceive billReceive, Client client, Systore.Domain.Entities.BillReceive billReceiveCheck)
        {
            if ((client.code != billReceiveCheck.ClientId) && (Utils.OnlyNumbers(client.cpf) != "00925146692"))
                return false;
            if (billReceive.code != billReceiveCheck.Code)
                return false;
            if (billReceive.quota != billReceiveCheck.Quota)
                return false;
            if (decimal.Round(billReceive.original_value, 2, MidpointRounding.AwayFromZero) != billReceiveCheck.OriginalValue)
                return false;
            if (decimal.Round(billReceive.interest, 2, MidpointRounding.AwayFromZero) != billReceiveCheck.Interest)
                return false;
            if (decimal.Round(billReceive.final_value, 2, MidpointRounding.AwayFromZero) != billReceiveCheck.FinalValue)
                return false;
            if ((billReceive.purchase_date ?? DateTime.MinValue.ToUniversalTime()).Date != billReceiveCheck.PurchaseDate.Date)
                return false;
            if ((billReceive.due_date ?? DateTime.MinValue.ToUniversalTime()).Date != billReceiveCheck.DueDate.Date)
                return false;
            if (billReceive.pay_date?.Date != billReceiveCheck.PayDate?.Date)
                return false;
            if (billReceive.days_delay != billReceiveCheck.DaysDelay)
                return false;
            if (billReceive.situation != billReceiveCheck.Situation.GetSituationString())
                return false;
            if (billReceive.vendor != billReceiveCheck.Vendor)
                return false;
            return true;
        }

        public static bool IsEqual(this Client client, Systore.Domain.Entities.Client clientCheck)
        {
            if (client.name != clientCheck.Name)
                return false;
            if ((client.code != clientCheck.Id) && (Utils.OnlyNumbers(client.cpf) != "00925146692"))
                return false;
            if (client.registry_date?.Date != clientCheck.RegistryDate?.Date)
                return false;
            if (client.date_of_birth?.Date != clientCheck.DateOfBirth?.Date)
                return false;
            if ((client.address ?? "") != clientCheck.Address)
                return false;
            if ((client.neighborhood ?? "") != clientCheck.Neighborhood)
                return false;
            if ((client.city ?? "") != clientCheck.City)
                return false;
            if ((client.state ?? "") != clientCheck.State)
                return false;
            if ((client.postal_code ?? "") != clientCheck.PostalCode)
                return false;
            if (Utils.OnlyNumbers(client.cpf) != clientCheck.Cpf)
                return false;
            if ((client.seller ?? "") != clientCheck.Seller)
                return false;
            if ((client.job_name ?? "") != clientCheck.JobName)
                return false;
            if ((client.occupation ?? "") != clientCheck.Occupation)
                return false;
            if ((client.place_of_birth ?? "") != clientCheck.PlaceOfBirth)
                return false;
            if ((client.spouse ?? "") != clientCheck.Spouse)
                return false;
            if ((client.note ?? "") != clientCheck.Note)
                return false;
            if ((client.phone1 ?? "") != clientCheck.Phone1)
                return false;
            if ((client.phone2 ?? "") != clientCheck.Phone2)
                return false;
            if ((client.address_number ?? "") != clientCheck.AddressNumber)
                return false;
            if ((client.rg ?? "") != clientCheck.Rg)
                return false;
            if ((client.complement ?? "") != clientCheck.Complement)
                return false;
            if (client.admission_date?.Date != clientCheck.AdmissionDate?.Date)
                return false;
            if (client.civil_status != (int)clientCheck.CivilStatus)
                return false;
            if ((client.father_name ?? "") != clientCheck.FatherName)
                return false;
            if ((client.mother_name ?? "") != clientCheck.MotherName)
                return false;
            return true;
        }
    }
}
