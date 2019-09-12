using System;
using System.Threading.Tasks;
using Systore.Domain.Abstractions;
using FastReport.Export.PdfSimple;
using System.IO;
using Systore.Domain;

namespace Systore.Report
{
    public class Report : IReport
    {

        private readonly AppSettings _appSettings;

        public Report(AppSettings appSettings)
        {
            _appSettings = appSettings;
        }

        public async Task<byte[]> GenerateReport(string reportFile, params object[] parameters)
        {
            return await Task.Factory.StartNew(() => InternalGenerateReport(reportFile, parameters));
        }

        private byte[] InternalGenerateReport(string reportFile, params object[] parameters)
        {
            FastReport.Report report = new FastReport.Report();
            report.Load(Path.Combine("Reports", "RelatoriosInadimplentes.frx"));

            report.Dictionary.Connections[0].ConnectionString = _appSettings.ConnectionString;
            //report.SetParameterValue("initialDate", new DateTime(2019, 1, 1));
            //report.SetParameterValue("finalDate", new DateTime(2019, 1, 7));          
            report.SetParameterValue("initialDate", "2019-01-01");
            report.SetParameterValue("finalDate", "2019-01-07");
            report.Prepare();

            // report.Parameters[0].Value = 143;
            //report.Refresh();

            PDFSimpleExport export = new PDFSimpleExport();
            using (MemoryStream ms = new MemoryStream())
            {
                report.Export(export, ms);
                ms.Flush();
                return ms.ToArray();
            }
        }
    }
}
