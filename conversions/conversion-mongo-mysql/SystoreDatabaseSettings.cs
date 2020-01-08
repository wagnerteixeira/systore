namespace conversion_mongo_mysql
{

    public interface ISystoreDatabaseSettings
    {
        string ClientCollectionName { get; set; }
        string BillReceiveCollectionName { get; set; }
        string UserCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }

    public class SystoreDatabaseSettings : ISystoreDatabaseSettings
    {
        public string ClientCollectionName { get; set; }
        public string BillReceiveCollectionName { get; set; }
        public string UserCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}