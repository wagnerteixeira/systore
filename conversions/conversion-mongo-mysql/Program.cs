using System;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Linq;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.FileExtensions;
using System.IO;
using conversion_mongo_mysql.Models;
using Systore.Data.Repositories;
using Systore.Infra.Context;
using System.Threading.Tasks;
using Systore.Infra;

namespace conversion_mongo_mysql
{
    class Program
    {
        public static IConfigurationRoot Configuration { get; set; }
        private static SystoreContextFactory _systoreContextFactory = new SystoreContextFactory();
        private static ISystoreDatabaseSettings _settings;
        private static List<Tuple<int, string, string>> clientsInserted = new List<Tuple<int, string, string>>();

        static void Main(string[] args)
        {
            MainAsync(args).GetAwaiter().GetResult();
        }

        static async Task MainAsync(string[] args)
        {
            await Convert();
            Console.WriteLine("Acabou");
        }

        public static async Task<string> InserirBillReceive(BillReceive billReceive, List<string> billsReceiveInserted)
        {

            try
            {
                SystoreContext context = _systoreContextFactory.CreateDbContext(new string[] { });
                var tuple = clientsInserted.Where(c => c.Item2 == billReceive.client).FirstOrDefault();
                if (tuple == null)
                    throw new Exception($"Cliente {billReceive.client} da parcela {billReceive.code}-{billReceive.quota} não encontrado");
                int clientId = clientsInserted.Where(c => c.Item2 == billReceive.client).FirstOrDefault().Item1;
                var _billReceive = new Systore.Domain.Entities.BillReceive()
                {
                    ClientId = clientId,
                    Code = billReceive.code,
                    DaysDelay = billReceive.days_delay,
                    DueDate = billReceive.due_date.HasValue ? DateTime.SpecifyKind(billReceive.due_date.Value, DateTimeKind.Utc) : DateTime.MinValue,
                    FinalValue = billReceive.final_value,
                    Interest = billReceive.interest,
                    OriginalValue = billReceive.original_value,
                    PayDate = billReceive.pay_date.HasValue ? DateTime.SpecifyKind(billReceive.pay_date.Value, DateTimeKind.Utc) : billReceive.pay_date ,
                    PurchaseDate = billReceive.purchase_date.HasValue ? DateTime.SpecifyKind(billReceive.purchase_date.Value, DateTimeKind.Utc) : DateTime.MinValue,
                    Quota = billReceive.quota,
                    Situation = billReceive.situation == "O" ? Systore.Domain.Enums.BillReceiveSituation.Open : Systore.Domain.Enums.BillReceiveSituation.Closed,
                    Vendor = billReceive.vendor,
                };

                string retBill = await new BillReceiveRepository(context, null).AddAsync(_billReceive);

                if (string.IsNullOrWhiteSpace(retBill))
                {
                    Console.WriteLine($"BillReceive: ClientId: {clientId} {_billReceive.Code}-{_billReceive.Quota} inserido com sucesso");
                    billsReceiveInserted.Add($"BillReceive: ClientId: {clientId} {_billReceive.Code}-{_billReceive.Quota} inserido com sucesso");
                    return ""; 
                }
                else
                {
                    Console.WriteLine($"Erro ao inserir BillReceive: ClientId: {clientId} {_billReceive.Code}-{_billReceive.Quota} : {retBill}");
                    billsReceiveInserted.Add($"Erro ao inserir BillReceive: ClientId: {clientId} {_billReceive.Code}-{_billReceive.Quota} : {retBill}");
                    return $"Erro ao inserir BillReceive: ClientId: {clientId} {_billReceive.Code}-{_billReceive.Quota} : {retBill}";
                }
            }
            catch (Exception e)
            {
                billsReceiveInserted.Add($"Erro ao inserir BillReceive: {billReceive.code}-{billReceive.quota} : {e.Message}");
                Console.WriteLine($"Erro ao inserir BillReceive: {billReceive.code}-{billReceive.quota} : {e.Message}");
                return $"Erro ao inserir BillReceive: {billReceive.code}-{billReceive.quota} : {e.Message}";
            }
        }

        public static async Task<string> InserirCliente(
             string clientId,
            Systore.Domain.Entities.Client client,
            List<Tuple<int, string, string>> clientsInserted,
            IMongoDatabase mongoDatabase)
        {
            try
            {
                SystoreContext context = _systoreContextFactory.CreateDbContext(new string[] { });
                Console.WriteLine($"Inserindo cliente {client.Name}-{client.Cpf}");
                string ret = await new ClientRepository(context, null).AddAsync(client);
                if (string.IsNullOrWhiteSpace(ret))
                {
                    clientsInserted.Add(new Tuple<int, string, string>(client.Id, clientId, $"Client  {client.Id}-{client.Name}-{client.Cpf} inserido com suceso"));
                    Console.WriteLine($"Client  {client.Id}-{client.Name}-{client.Cpf} inserido com suceso.");
                }
                else
                {
                    clientsInserted.Add(new Tuple<int, string, string>(-1, "", $"Erro ao inserir Client {client.Name}-{client.Cpf}: {ret}"));
                    Console.WriteLine($"Erro ao inserir Client {client.Name}-{client.Cpf}: {ret}");
                    return $"Erro ao inserir Client {client.Name}-{client.Cpf}: {ret}";
                }
                return "";
            }
            catch (Exception e)
            {
                clientsInserted.Add(new Tuple<int, string, string>(-1, clientId, $"Erro ao inserir Client {client.Name}-{client.Cpf}: {e.Message}"));
                Console.WriteLine($"Erro ao inserir Client {client.Name}-{client.Cpf}: {e.Message}");
                return $"Erro ao inserir Client {client.Name}-{client.Cpf}: {e.Message}";
            }

        }

        static async Task Convert()
        {

            List<Task<string>> tarefasCliente = new List<Task<string>>();
            List<Task<string>> tarefasBillsReceive = new List<Task<string>>();


            List<string> billsReceiveInserted = new List<string>();

            var builder =
             new ConfigurationBuilder().
             SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");


            Configuration = builder.Build();
            _settings = new SystoreDatabaseSettings();
            Configuration.GetSection("SystoreDatabaseSettings").Bind(_settings);
            Console.WriteLine();
            var clientMongo = new MongoClient(_settings.ConnectionString);
            var database = clientMongo.GetDatabase(_settings.DatabaseName);

            var billReceives = database.GetCollection<BillReceive>(_settings.BillReceiveCollectionName);
            var clients = database.GetCollection<Client>(_settings.ClientCollectionName);
            // var users = database.GetCollection<Client>(settings.UserCollectionName);        
            foreach (var client in clients.Find(c => c.Id != "5d0c6510772d38518a5786fa").ToList())
            {
                var _client = new Systore.Domain.Entities.Client();
                try
                {
                    _client.Id = client.code;
                    _client.Address = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.address ?? ""));
                    _client.AddressNumber = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.address_number ?? ""));
                    _client.City = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.city ?? ""));
                    _client.CivilStatus = (Systore.Domain.Enums.CivilStatus)client.civil_status;
                    _client.Complement = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.complement ?? ""));
                    _client.Cpf = client.cpf;
                    _client.FatherName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.father_name ?? ""));
                    _client.JobName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.job_name ?? ""));
                    _client.DateOfBirth = client.date_of_birth.HasValue ? DateTime.SpecifyKind(client.date_of_birth.Value, DateTimeKind.Utc) : client.date_of_birth;
                    _client.AdmissionDate = client.admission_date.HasValue ? DateTime.SpecifyKind(client.admission_date.Value, DateTimeKind.Utc) : client.admission_date;
                    _client.MotherName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.mother_name ?? ""));
                    _client.Name = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.name ?? ""));
                    _client.Neighborhood = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.neighborhood ?? ""));
                    _client.Note = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.note ?? ""));
                    _client.Occupation = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.occupation ?? ""));
                    _client.Phone1 = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.phone1 ?? ""));
                    _client.Phone2 = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.phone2 ?? ""));
                    _client.PlaceOfBirth = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.place_of_birth ?? ""));
                    _client.PostalCode = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.postal_code ?? ""));
                    _client.Rg = client.rg;
                    _client.RegistryDate = client.registry_date.HasValue ? DateTime.SpecifyKind(client.registry_date.Value, DateTimeKind.Utc) : client.registry_date;
                    _client.Seller = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.seller ?? ""));
                    _client.Spouse = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.spouse ?? ""));
                    _client.State = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(client.state ?? ""));
                }
                catch (Exception e)
                {
                    Console.WriteLine("Esse: ", e.Message);
                }
                await InserirCliente(client.Id, _client, clientsInserted, database);
            }

            Task.WaitAll(tarefasCliente.ToArray());

            var arrayBillReceives = billReceives.Find(c => c.client != "5d0c6510772d38518a5786fa").ToList().ToArray();
            for (int i = 0; i < arrayBillReceives.Count(); i++)
            {
                billsReceiveInserted.Add($"Inserindo registro {i}");
                await InserirBillReceive(arrayBillReceives[i], billsReceiveInserted);
            }



            Task.WaitAll(tarefasBillsReceive.ToArray());

            var clientEx = clients.Find(c => c.Id == "5d0c6510772d38518a5786fa").ToList().FirstOrDefault();

            var _clientEx = new Systore.Domain.Entities.Client();
            try
            {
                _clientEx.Address = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.address ?? ""));
                _clientEx.AddressNumber = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.address_number ?? ""));
                _clientEx.City = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.city ?? ""));
                _clientEx.CivilStatus = (Systore.Domain.Enums.CivilStatus)clientEx.civil_status;
                _clientEx.Complement = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.complement ?? ""));
                _clientEx.Cpf = clientEx.cpf;
                _clientEx.FatherName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.father_name ?? ""));
                _clientEx.JobName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.job_name ?? ""));
                _clientEx.DateOfBirth = clientEx.date_of_birth.HasValue ? DateTime.SpecifyKind(clientEx.date_of_birth.Value, DateTimeKind.Utc) : clientEx.date_of_birth;
                _clientEx.AdmissionDate = clientEx.admission_date.HasValue ? DateTime.SpecifyKind(clientEx.admission_date.Value, DateTimeKind.Utc) : clientEx.admission_date;
                _clientEx.MotherName = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.mother_name ?? ""));
                _clientEx.Name = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.name ?? ""));
                _clientEx.Neighborhood = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.neighborhood ?? ""));
                _clientEx.Note = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.note ?? ""));
                _clientEx.Occupation = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.occupation ?? ""));
                _clientEx.Phone1 = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.phone1 ?? ""));
                _clientEx.Phone2 = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.phone2 ?? ""));
                _clientEx.PlaceOfBirth = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.place_of_birth ?? ""));
                _clientEx.PostalCode = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.postal_code ?? ""));
                _clientEx.Rg = clientEx.rg;
                _clientEx.RegistryDate = clientEx.registry_date.HasValue ? DateTime.SpecifyKind(clientEx.registry_date.Value, DateTimeKind.Utc) : clientEx.registry_date;
                _clientEx.Seller = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.seller ?? ""));
                _clientEx.Spouse = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.spouse ?? ""));
                _clientEx.State = System.Text.Encoding.ASCII.GetString(System.Text.Encoding.ASCII.GetBytes(clientEx.state ?? ""));
            }
            catch (Exception e)
            {
                Console.WriteLine("Esse: ", e.Message);
            }
            SystoreContext context = _systoreContextFactory.CreateDbContext(new string[] { });
            Console.WriteLine($"Inserindo cliente {_clientEx.Name}-{_clientEx.Cpf}");
            string ret = await new ClientRepository(context, null).AddAsync(_clientEx);
            if (string.IsNullOrWhiteSpace(ret))
            {
                clientsInserted.Add(new Tuple<int, string, string>(_clientEx.Id, clientEx.Id, $"Client  {_clientEx.Id}-{_clientEx.Name}-{_clientEx.Cpf} inserido com suceso"));
                Console.WriteLine($"Client  {_clientEx.Id}-{_clientEx.Name}-{_clientEx.Cpf} inserido com suceso.");
            }
            else
            {
                clientsInserted.Add(new Tuple<int, string, string>(-1, "", $"Erro ao inserir Client {_clientEx.Name}-{_clientEx.Cpf}: {ret}"));
                Console.WriteLine($"Erro ao inserir Client {_clientEx.Name}-{_clientEx.Cpf}: {ret}");
            }

            foreach (var billReceive in (await (await billReceives.FindAsync(c => c.client == "5d0c6510772d38518a5786fa")).ToListAsync()))
            {
                var _billReceive = new Systore.Domain.Entities.BillReceive()
                {
                    ClientId = _clientEx.Id,
                    Code = billReceive.code,
                    DaysDelay = billReceive.days_delay,
                    DueDate = billReceive.due_date.HasValue ? DateTime.SpecifyKind(billReceive.due_date.Value, DateTimeKind.Utc) : DateTime.MinValue,
                    FinalValue = billReceive.final_value,
                    Interest = billReceive.interest,
                    OriginalValue = billReceive.original_value,
                    PayDate = billReceive.pay_date.HasValue ? DateTime.SpecifyKind(billReceive.pay_date.Value, DateTimeKind.Utc) : billReceive.pay_date,
                    PurchaseDate = billReceive.purchase_date.HasValue ? DateTime.SpecifyKind(billReceive.purchase_date.Value, DateTimeKind.Utc) : DateTime.MinValue,
                    Quota = billReceive.quota,
                    Situation = billReceive.situation == "O" ? Systore.Domain.Enums.BillReceiveSituation.Open : Systore.Domain.Enums.BillReceiveSituation.Closed,
                    Vendor = billReceive.vendor,
                };

                string retBill = await new BillReceiveRepository(context, null).AddAsync(_billReceive);

                if (string.IsNullOrWhiteSpace(retBill))
                {
                    Console.WriteLine($"BillReceive: ClientId: {_clientEx.Id} {_billReceive.Code}-{_billReceive.Quota} inserido com sucesso");
                    billsReceiveInserted.Add($"BillReceive: ClientId: {_clientEx.Id} {_billReceive.Code}-{_billReceive.Quota} inserido com sucesso");
                }
                else
                {
                    Console.WriteLine($"Erro ao inserir BillReceive: ClientId: {_clientEx.Id} {_billReceive.Code}-{_billReceive.Quota} : {retBill}");
                    billsReceiveInserted.Add($"Erro ao inserir BillReceive: ClientId: {_clientEx.Id} {_billReceive.Code}-{_billReceive.Quota} : {retBill}");
                }
            }

            List<string> arquivoSaida = new List<string>();

            arquivoSaida.AddRange(clientsInserted.Select(c => c.Item3).ToList());
            arquivoSaida.AddRange(billsReceiveInserted);

            File.WriteAllLines(AppDomain.CurrentDomain.BaseDirectory + "\\log.txt", arquivoSaida);

            Console.WriteLine("Fora do for");
        }
    }
}



