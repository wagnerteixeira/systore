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

namespace check_conversion_mongo_mysql
{
    class Program
    {
        public static IConfigurationRoot Configuration { get; set; }
        private static SystoreContextFactory _systoreContextFactory = new SystoreContextFactory();
        private static ISystoreDatabaseSettings _settings;

        static void Main(string[] args)
        {
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

            /*if (countClientesMysql != (int)countClientsMongo)
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
            }*/
            int clientsProcessed = 0;
            while (clientsProcessed < countClientesMysql)
            {
                foreach (var clientMysql in clientRepository
                    .GetAll()
                    .Skip(clientsProcessed)
                    .Take(1000))
                {
                    var clientMongo = clients.Find(c => c.code == clientMysql.Id).ToList().FirstOrDefault();
                    if (!clientMongo.IsEqual(clientMysql))
                    {
                        Console.WriteLine($"Cliente {clientMysql.Id} incorreto");
                        Console.ReadKey();
                        var client2 = clientRepository.GetAll().Where(c => c.Id == clientMysql.Id).ToList().FirstOrDefault();
                        clientMongo.IsEqual(client2);

                        
                    }
                }
            }
        }
    }
}
