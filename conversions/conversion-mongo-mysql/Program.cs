using System;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.FileExtensions;
using System.IO;
using conversion_mongo_mysql.Models;
using Systore.Data.Repositories;
using Systore.Context.Infra;
using System.Threading.Tasks;

namespace conversion_mongo_mysql
{
  class Program
  {
    public static IConfigurationRoot Configuration { get; set; }

    static async Task Main(string[] args)
    {
      await Convert();
      Console.WriteLine("Acabou");

    }

    static async Task Convert()
    {

      List<string> clientsInserted = new List<string>();
      List<string> billsReceiveInserted = new List<string>();

      var builder =
       new ConfigurationBuilder().
       SetBasePath(Directory.GetCurrentDirectory())
      .AddJsonFile("appsettings.json");


      Configuration = builder.Build();
      ISystoreDatabaseSettings settings = new SystoreDatabaseSettings();
      Configuration.GetSection("SystoreDatabaseSettings").Bind(settings);
      Console.WriteLine();
      var clientMongo = new MongoClient(settings.ConnectionString);
      var database = clientMongo.GetDatabase(settings.DatabaseName);

      var billReceives = database.GetCollection<BillReceive>(settings.BillReceiveCollectionName);
      var clients = database.GetCollection<Client>(settings.ClientCollectionName);

      // var users = database.GetCollection<Client>(settings.UserCollectionName);
      SystoreContext context = new SystoreContext();

      BillReceiveRepository billReceiveRepository = new BillReceiveRepository(context);

      billReceiveRepository.ExecuteCommand("delete from BillReceive", new object[] { });

      ClientRepository clientRepository = new ClientRepository(context);

      clientRepository.ExecuteCommand("delete from Client", new object[] { });

      foreach (var client in clients.Find(c => true).ToList())
      {
        Console.WriteLine($"Inserindo cliente {client.name}-{client.cpf}");
        var _client = new Systore.Domain.Entities.Client()
        {
          Id = client.code,
          Address = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.address)),
          AddressNumber = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.address_number)),
          City = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.city)),
          CivilStatus = (Systore.Domain.Enums.CivilStatus)client.civil_status,
          //Code = client.code,
          Complement = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.complement)),
          Cpf = client.cpf,
          FatherName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.father_name)),
          JobName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.job_name)),
          DateOfBirth = client.date_of_birth,
          AdmissionDate = client.admission_date,
          MotherName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.mother_name)),
          Name = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.name)),
          Neighborhood = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.neighborhood)),
          Note = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.note)),
          Occupation = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.occupation)),
          Phone1 = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.phone1)),
          Phone2 = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.phone2)),
          PlaceOfBirth = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.place_of_birth)),
          PostalCode = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.postal_code)),
          Rg = client.rg,
          RegistryDate = client.registry_date,
          Seller = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.seller)),
          Spouse = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.spouse)),
          State = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.state)),
        };

        string ret = await new ClientRepository(new SystoreContext()).Add(_client);
        if (string.IsNullOrWhiteSpace(ret))
        {
          Console.WriteLine($"Client {_client.Id}-{_client.Name}-{_client.Cpf} inserido com sucesso");
          clientsInserted.Add($"Client {_client.Id}-{_client.Name}-{_client.Cpf} inserido com sucesso");
        }
        else
        {
          Console.WriteLine($"Erro ao inserir Client {client.name}-{client.cpf}: {ret}");
          return;
        }

        foreach (var billReceive in billReceives.Find(c => c.client == client.Id).ToList())
        {
          var _billReceive = new Systore.Domain.Entities.BillReceive()
          {
            ClientId = _client.Id,
            Code = billReceive.code,
            DaysDelay = billReceive.days_delay,
            DueDate = billReceive.due_date ?? DateTime.MinValue,
            FinalValue = billReceive.final_value,
            Interest = billReceive.interest,
            OriginalValue = billReceive.original_value,
            PayDate = billReceive.pay_date,
            PurchaseDate = billReceive.purchase_date ?? DateTime.MinValue,
            Quota = billReceive.quota,
            Situation = billReceive.situation == "O" ? Systore.Domain.Enums.BillReceiveSituation.Open : Systore.Domain.Enums.BillReceiveSituation.Closed,
            Vendor = billReceive.vendor,
          };

          string retBill = await new BillReceiveRepository(new SystoreContext()).Add(_billReceive);
          if (string.IsNullOrWhiteSpace(ret))
          {
            Console.WriteLine($"BillReceive {_billReceive.Code}-{_billReceive.Quota} inserido com sucesso");
            clientsInserted.Add($"BillReceive {_billReceive.Code}-{_billReceive.Quota} inserido com sucesso");            
          }
          else
          {
            Console.WriteLine($"Erro ao inserir BillReceive {billReceive.code}-{billReceive.quota} : {retBill}");
            return;
          }
        }

      }

      Console.WriteLine("Fora do for");

    }
  }
}



