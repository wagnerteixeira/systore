using conversion_mongo_mysql;
using conversion_mongo_mysql.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.IO;
using System.Linq;
using Systore.Data.Repositories;
using Systore.Infra;
using Systore.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace check_conversion_mongo_mysql
{
    class Program
    {
        public static IConfigurationRoot Configuration { get; set; }
        private static SystoreContextFactory _systoreContextFactory = new SystoreContextFactory();
        private static ISystoreDatabaseSettings _settings;

        static void Main(string[] args)
        {
            int clientsProceed = 0;
            int billsReceiveProceed = 0;
            var builder =
             new ConfigurationBuilder().
             SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json");


            Configuration = builder.Build();
            _settings = new SystoreDatabaseSettings();
            Configuration.GetSection("SystoreDatabaseSettings").Bind(_settings);
            Console.WriteLine();
            var mongoClient = new MongoClient(_settings.ConnectionString);
            var database = mongoClient.GetDatabase(_settings.DatabaseName);

            var clients = database.GetCollection<Client>(_settings.ClientCollectionName);
            var billReceives = database.GetCollection<BillReceive>(_settings.BillReceiveCollectionName);


            SystoreContext context = _systoreContextFactory.CreateDbContext(new string[] { });

            var clientRepository = new ClientRepository(context, null);
            var billReceiveRepository = new BillReceiveRepository(context, null);

            var countClientesMysql = clientRepository.CountAllAsync().GetAwaiter().GetResult();
            var countClientsMongo = clients.CountDocuments(c => true);

            var countBillReceiveMysql = billReceiveRepository.CountAllAsync().GetAwaiter().GetResult();
            var countBillReceiveMongo = billReceives.CountDocuments(c => true);

            if (countClientesMysql != (int)countClientsMongo)
            {
                Console.WriteLine("Quantidade de clientes icorreta.");
                Console.ReadKey();
                return;
            }

            if (countBillReceiveMysql != (int)countBillReceiveMongo)
            {
                Console.WriteLine("Quantidade de títulos icorreta.");
                Console.ReadKey();
                return;
            }
             clientsProceed = 27294;
             while (clientsProceed < countClientesMysql)
             {

                 foreach (var clientMongo in clients
                     .Find(c => true)
                     // .Find(c=> c.code == 71624)
                     .Skip(clientsProceed)
                     .Limit(1000)
                     .ToList())
                 {
                     Systore.Domain.Entities.Client clientMysql;
                     if (!string.IsNullOrWhiteSpace(clientMongo.cpf))
                     {
                         var clientsMysql = clientRepository.GetAll().Where(c => c.Cpf == Utils.OnlyNumbers(clientMongo.cpf)).ToList();
                         if (clientsMysql.Count > 1)
                         {
                             Console.WriteLine($"Cliente do cpf {clientMongo.cpf} duplicado");
                             clientMysql = clientsMysql.Where(c => c.Id == clientMongo.code).FirstOrDefault();
                         }
                         else
                             clientMysql = clientsMysql.FirstOrDefault();
                     }
                     else
                         clientMysql = clientRepository.GetAll().Where(c => c.Id == clientMongo.code).FirstOrDefault();
                    if ((clientMongo == null) || (clientMysql == null))
                        throw new NotSupportedException("Erro");
                     if (!clientMongo.IsEqual(clientMysql))
                     {
                         Console.WriteLine($"Cliente {clientMysql.Id} incorreto {clientsProceed}");
                         Console.ReadKey();
                         var client2 = clientRepository.GetAll().Where(c => c.Id == clientMysql.Id).ToList().FirstOrDefault();
                         clientMongo.IsEqual(client2);
                     }
                     else
                         Console.WriteLine($"Cliente {clientMysql.Id} correto {clientsProceed}");
                    clientsProceed++;
                 }


             }
            billsReceiveProceed = 0;
            while (billsReceiveProceed < countBillReceiveMongo)
            {

                foreach (var billReceiveMongo in billReceives
                        .Find(c => true)
                     .Skip(billsReceiveProceed)
                     .Limit(1000)
                     .SortBy(c => c.Id)
                     .ToList())
                {
                    Client clientMongo = clients.Find(c => c.Id == billReceiveMongo.client).FirstOrDefault();

                    Systore.Domain.Entities.Client clientMysql = null;
                    var clientsMysql = clientRepository.GetAll().Where(c => c.Id == clientMongo.code).ToList();
                    if (clientsMysql.Count != 1 || (clientsMysql.Count == 1 && clientsMysql.FirstOrDefault().Cpf != Utils.OnlyNumbers(clientMongo.cpf)))
                    {
                        if (!string.IsNullOrWhiteSpace(clientMongo.cpf))
                        {
                            clientMysql = clientRepository
                                .GetAll()
                                .Where(c => c.Cpf == Utils.OnlyNumbers(clientMongo.cpf))
                                .FirstOrDefault();
                        }
                        else
                            throw new NotSupportedException("Não é possivel definir");
                    }
                    else 
                        clientMysql = clientsMysql.FirstOrDefault();

                    var billReceivesMysql = billReceiveRepository
                        .GetAll()
                        .Where(c => c.Code == billReceiveMongo.code && c.Quota == billReceiveMongo.quota && c.ClientId == clientMysql.Id).ToList();


                    if (billReceivesMysql.Count != 1)
                        throw new NotSupportedException("Não é possivel definir");

                    var billReceiveMysql = billReceivesMysql.FirstOrDefault();

                    if (!billReceiveMongo.IsEqual(clientMongo, billReceiveMysql))
                    {
                        Console.WriteLine($" {billsReceiveProceed} - BillReceive {billReceiveMysql.Code} - {billReceiveMysql.Quota} do Cliente {billReceiveMysql.ClientId} - {clientMysql.Name} incorreto");
                        Console.ReadKey();

                    }
                    else
                        Console.WriteLine($" {billsReceiveProceed} - BillReceive {billReceiveMysql.Code} - {billReceiveMysql.Quota} do Cliente {billReceiveMysql.ClientId} - {clientMysql.Name} correto");
                    billsReceiveProceed++;
                }
            }

            Console.WriteLine($"Clientes processados: {clientsProceed}");
            Console.WriteLine($"Parcelas de titulos processadas: {billsReceiveProceed}");
            Console.ReadKey();
        }
    }
}
