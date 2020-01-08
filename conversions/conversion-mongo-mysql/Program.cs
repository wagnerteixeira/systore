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
                    DueDate = (addhour(billReceive.due_date) ?? DateTime.MinValue.ToUniversalTime()), //billReceive.due_date.HasValue ? DateTime.SpecifyKind(billReceive.due_date.Value, DateTimeKind.Local) : DateTime.MinValue.ToUniversalTime(),
                    FinalValue = billReceive.final_value,
                    Interest = billReceive.interest,
                    OriginalValue = billReceive.original_value,
                    PayDate = addhour(billReceive.pay_date), //billReceive.pay_date.HasValue ? DateTime.SpecifyKind(billReceive.pay_date.Value, DateTimeKind.Local) : billReceive.pay_date,
                    PurchaseDate = (addhour(billReceive.purchase_date) ?? DateTime.MinValue.ToUniversalTime()),// billReceive.purchase_date.HasValue ? DateTime.SpecifyKind(billReceive.purchase_date.Value, DateTimeKind.Local) : DateTime.MinValue.ToUniversalTime(),
                    Quota = billReceive.quota,
                    Situation = billReceive.situation == "O" ? Systore.Domain.Enums.BillReceiveSituation.Open : Systore.Domain.Enums.BillReceiveSituation.Closed,
                    Vendor = billReceive.vendor,
                };
                var billReceiveRepository = new BillReceiveRepository(context, null);
                billReceiveRepository.IsConversion = true;
                string retBill = await billReceiveRepository.AddAsync(_billReceive);

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
                var clientRepository = new ClientRepository(context, null);
                clientRepository.IsConversion = true;
                client.Cpf = Utils.OnlyNumbers(client.Cpf);
                string ret = await clientRepository.AddAsync(client);
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

        static DateTime addhour(DateTime dateTime)
        {
            if ((dateTime.Hour == 2) && (dateTime.Minute == 0))
                return dateTime.AddHours(1);
            else
                return dateTime;
        }

        static DateTime? addhour(DateTime? dateTime)
        {
            if (dateTime.HasValue)
            {
                if ((dateTime?.Hour == 2) && (dateTime?.Minute == 0))
                    return dateTime?.AddHours(1);
                else
                    return dateTime;
            }
            else
                return dateTime;
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

            string clientId = "";

            var billReceives = database.GetCollection<BillReceive>(_settings.BillReceiveCollectionName);
            var clients = database.GetCollection<Client>(_settings.ClientCollectionName);
            // var users = database.GetCollection<Client>(settings.UserCollectionName);        
            foreach (var client in clients.Find(c => c.Id != "5d0ce3f2b796df5a27c4f76e").ToList())
            //foreach (var client in clients.Find(c => c.code == 704).ToList())
            {
                var _client = new Systore.Domain.Entities.Client();
                try
                {
                    client.date_of_birth = addhour(client.date_of_birth); // client.date_of_birth.HasValue ? DateTime.SpecifyKind(client.date_of_birth.Value, DateTimeKind.Local) : client.date_of_birth;
                    client.admission_date = addhour(client.admission_date); //client.admission_date.HasValue ? DateTime.SpecifyKind(client.admission_date.Value, DateTimeKind.Local) : client.admission_date;
                    client.registry_date = addhour(client.registry_date); //client.registry_date.HasValue ? DateTime.SpecifyKind(client.registry_date.Value, DateTimeKind.Local) : client.registry_date;


                    _client.Id = client.code;
                    clientId = client.Id;
                    _client.Address = client.address ?? "";
                    _client.AddressNumber = client.address_number ?? "";
                    _client.City = client.city ?? "";
                    _client.CivilStatus = (Systore.Domain.Enums.CivilStatus)client.civil_status;
                    _client.Complement = client.complement ?? "";
                    _client.Cpf = Utils.OnlyNumbers(client.cpf);
                    _client.FatherName = client.father_name ?? "";
                    _client.JobName = client.job_name ?? "";
                    _client.DateOfBirth = client.date_of_birth; // client.date_of_birth.HasValue ? DateTime.SpecifyKind(client.date_of_birth.Value, DateTimeKind.Local) : client.date_of_birth;
                    _client.AdmissionDate = client.admission_date; //client.admission_date.HasValue ? DateTime.SpecifyKind(client.admission_date.Value, DateTimeKind.Local) : client.admission_date;
                    _client.MotherName = client.mother_name ?? "";
                    _client.Name = client.name ?? "";
                    _client.Neighborhood = client.neighborhood ?? "";
                    _client.Note = client.note ?? "";
                    _client.Occupation = client.occupation ?? "";
                    _client.Phone1 = client.phone1 ?? "";
                    _client.Phone2 = client.phone2 ?? "";
                    _client.PlaceOfBirth = client.place_of_birth ?? "";
                    _client.PostalCode = client.postal_code ?? "";
                    _client.Rg = client.rg ?? "";
                    _client.RegistryDate = client.registry_date; //client.registry_date.HasValue ? DateTime.SpecifyKind(client.registry_date.Value, DateTimeKind.Local) : client.registry_date;
                    _client.Seller = client.seller ?? "";
                    _client.Spouse = client.spouse ?? "";
                    _client.State = client.state ?? "";

                }
                catch (Exception e)
                {
                    Console.WriteLine("Esse: ", e.Message);
                }
                await InserirCliente(client.Id, _client, clientsInserted, database);
            }

            Task.WaitAll(tarefasCliente.ToArray());

            var arrayBillReceives = billReceives.Find(c => c.client != "5d0ce3f2b796df5a27c4f76e").ToList().ToArray();
            //var arrayBillReceives = billReceives.Find(c => c.client == clientId).ToList().ToArray();
            for (int i = 0; i < arrayBillReceives.Count(); i++)
            {
                billsReceiveInserted.Add($"Inserindo registro {i}");
                await InserirBillReceive(arrayBillReceives[i], billsReceiveInserted);
            }

          
            Task.WaitAll(tarefasBillsReceive.ToArray());

            var clientEx = clients.Find(c => c.Id == "5d0ce3f2b796df5a27c4f76e").ToList().FirstOrDefault();

            var _clientEx = new Systore.Domain.Entities.Client();
            try
            {
                clientEx.date_of_birth = addhour(clientEx.date_of_birth); // client.date_of_birth.HasValue ? DateTime.SpecifyKind(client.date_of_birth.Value, DateTimeKind.Local) : client.date_of_birth;
                clientEx.admission_date = addhour(clientEx.admission_date); //client.admission_date.HasValue ? DateTime.SpecifyKind(client.admission_date.Value, DateTimeKind.Local) : client.admission_date;
                clientEx.registry_date = addhour(clientEx.registry_date); //client.registry_date.HasValue ? DateTime.SpecifyKind(client.registry_date.Value, DateTimeKind.Local) : client.registry_date;

                _clientEx.Address = clientEx.address ?? "";
                _clientEx.AddressNumber = clientEx.address_number ?? "";
                _clientEx.City = clientEx.city ?? "";
                _clientEx.CivilStatus = (Systore.Domain.Enums.CivilStatus)clientEx.civil_status;
                _clientEx.Complement = clientEx.complement ?? "";
                _clientEx.Cpf = Utils.OnlyNumbers(clientEx.cpf);
                _clientEx.FatherName = clientEx.father_name ?? "";
                _clientEx.JobName = clientEx.job_name ?? "";
                _clientEx.DateOfBirth = clientEx.date_of_birth; // clientEx.date_of_birth.HasValue ? DateTime.SpecifyKind(clientEx.date_of_birth.Value, DateTimeKind.Local) : clientEx.date_of_birth;
                _clientEx.AdmissionDate = clientEx.admission_date; //clientEx.admission_date.HasValue ? DateTime.SpecifyKind(clientEx.admission_date.Value, DateTimeKind.Local) : clientEx.admission_date;
                _clientEx.MotherName = clientEx.mother_name ?? "";
                _clientEx.Name = clientEx.name ?? "";
                _clientEx.Neighborhood = clientEx.neighborhood ?? "";
                _clientEx.Note = clientEx.note ?? "";
                _clientEx.Occupation = clientEx.occupation ?? "";
                _clientEx.Phone1 = clientEx.phone1 ?? "";
                _clientEx.Phone2 = clientEx.phone2 ?? "";
                _clientEx.PlaceOfBirth = clientEx.place_of_birth ?? "";
                _clientEx.PostalCode = clientEx.postal_code ?? "";
                _clientEx.Rg = clientEx.rg ?? "";
                _clientEx.RegistryDate = clientEx.registry_date;// clientEx.registry_date.HasValue ? DateTime.SpecifyKind(clientEx.registry_date.Value, DateTimeKind.Local) : clientEx.registry_date;
                _clientEx.Seller = clientEx.seller ?? "";
                _clientEx.Spouse = clientEx.spouse ?? "";
                _clientEx.State = clientEx.state ?? "";
            }
            catch (Exception e)
            {
                Console.WriteLine("Esse: ", e.Message);
            }
            SystoreContext context = _systoreContextFactory.CreateDbContext(new string[] { });
            Console.WriteLine($"Inserindo cliente {_clientEx.Name}-{_clientEx.Cpf}");
            var clientRepository = new ClientRepository(context, null);
            clientRepository.IsConversion = true;
            string ret = await clientRepository.AddAsync(_clientEx);
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

            foreach (var billReceive in (await (await billReceives.FindAsync(c => c.client == "5d0ce3f2b796df5a27c4f76e")).ToListAsync()))
            {
                var _billReceive = new Systore.Domain.Entities.BillReceive()
                {
                    ClientId = _clientEx.Id,
                    Code = billReceive.code,
                    DaysDelay = billReceive.days_delay,
                    DueDate = (addhour(billReceive.due_date) ?? DateTime.MinValue.ToUniversalTime()), //billReceive.due_date.HasValue ? DateTime.SpecifyKind(billReceive.due_date.Value, DateTimeKind.Local) : DateTime.MinValue.ToUniversalTime(),
                    FinalValue = billReceive.final_value,
                    Interest = billReceive.interest,
                    OriginalValue = billReceive.original_value,
                    PayDate = addhour(billReceive.pay_date), // billReceive.pay_date.HasValue ? DateTime.SpecifyKind(billReceive.pay_date.Value, DateTimeKind.Local) : billReceive.pay_date,
                    PurchaseDate = (addhour(billReceive.purchase_date) ?? DateTime.MinValue.ToUniversalTime()), //billReceive.purchase_date.HasValue ? DateTime.SpecifyKind(billReceive.purchase_date.Value, DateTimeKind.Local) : DateTime.MinValue.ToUniversalTime(),
                    Quota = billReceive.quota,
                    Situation = billReceive.situation == "O" ? Systore.Domain.Enums.BillReceiveSituation.Open : Systore.Domain.Enums.BillReceiveSituation.Closed,
                    Vendor = billReceive.vendor,
                };
                var billReceiveRepository = new BillReceiveRepository(context, null);
                billReceiveRepository.IsConversion = true;
                string retBill = await billReceiveRepository.AddAsync(_billReceive);

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

            Console.WriteLine("Fnalizou, verifique o log.txt");
            Console.ReadKey();
        }
    }
}



