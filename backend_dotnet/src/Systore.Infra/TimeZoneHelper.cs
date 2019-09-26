using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace Systore.Infra
{
    public static class TimeZoneHelper
    {
        public static string TimeZoneId => RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "E. South America Standard Time" : "America/Sao_Paulo";
    }
}
