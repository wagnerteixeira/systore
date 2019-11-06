using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace Systore.Infra
{
    public static class TimeZoneHelper
    {
        public static string TimeZoneId => RuntimeInformation.IsOSPlatform(OSPlatform.Windows) ? "E. South America Standard Time" : "America/Sao_Paulo";


        public static DateTime ConvertTimeFromUtc(DateTime value)
        {
            try
            {
                return TimeZoneInfo.ConvertTimeFromUtc(value, TimeZoneInfo.FindSystemTimeZoneById(TimeZoneHelper.TimeZoneId));
                    
            }
            catch
            {
                return DateTime.SpecifyKind(value, DateTimeKind.Local);
            }

        }
        public static DateTime ConvertTimeToUtc(DateTime value)
        {
            try
            {
                return TimeZoneInfo.ConvertTimeToUtc(value, TimeZoneInfo.FindSystemTimeZoneById(TimeZoneHelper.TimeZoneId));
            }
            catch
            {
                return DateTime.SpecifyKind(value, DateTimeKind.Utc).AddHours(3);
            }
        }

        public static DateTime? ConvertTimeFromUtc(DateTime? value)
        {           
            try
            {
                return value.HasValue ?
                        TimeZoneInfo.ConvertTimeFromUtc(value.Value, TimeZoneInfo.FindSystemTimeZoneById(TimeZoneHelper.TimeZoneId)) :
                        value;

            }
            catch
            {
                return value.HasValue ?
                        DateTime.SpecifyKind(value.Value, DateTimeKind.Local) :
                        value;

            }

        }
        public static DateTime? ConvertTimeToUtc(DateTime? value)
        {
            try
            {
                return value.HasValue ?
                        TimeZoneInfo.ConvertTimeToUtc(value.Value, TimeZoneInfo.FindSystemTimeZoneById(TimeZoneHelper.TimeZoneId)) :
                        value;
            }
            catch
            {
                return value.HasValue ?
                        DateTime.SpecifyKind(value.Value, DateTimeKind.Utc).AddHours(3) :
                        value;

            }
        }



    }
}
