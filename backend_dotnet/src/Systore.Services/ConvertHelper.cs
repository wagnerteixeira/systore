using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;

namespace Systore.Services
{
    public static class ConvertHelper
    {
        public static T ConvertToType<T>(StringReader reader, int digits, bool dateTime = false)
        {
            char[] buffer = new char[1000];

            reader.Read(buffer, 0, digits);
            if (typeof(T) == typeof(string))
            {
                return (T)(object)new String(buffer, 0, digits).TrimEnd();
            }
            else if (typeof(T) == typeof(int))
            {
                return (T)(object)new String(buffer, 0, digits).ToInt();
            }
            else if (typeof(T) == typeof(long))
            {
                return (T)(object)new String(buffer, 0, digits).ToLong();
            }
            else if (typeof(T) == typeof(decimal))
            {
                char[] value = buffer.Take(digits + 1).ToArray();
                Array.Reverse(value);
                for (int i = 1; i <= 2; i++)
                    value[i - 1] = value[i];
                value[2] = '.';
                Array.Reverse(value);
                return (T)(object)new String(value).ToDecimal();
            }
            else if (typeof(T) == typeof(int?))
            {
                var str = new String(buffer, 0, digits).Trim();
                if (str.Length == 0)
                    return (T)(object)null;
                else
                    return (T)(object)str.ToInt();
            }
            else if (typeof(T) == typeof(long?))
            {
                var str = new String(buffer, 0, digits).Trim();
                if (str.Length == 0)
                    return (T)(object)null;
                else
                    return (T)(object)str.ToLong();
            }
            else if (typeof(T) == typeof(decimal?))
            {
                var str = new String(buffer, 0, digits).Trim();
                if (str.Length == 0)
                    return (T)(object)null;
                else
                {
                    char[] value = buffer.Take(digits + 1).ToArray();
                    Array.Reverse(value);
                    for (int i = 1; i <= 2; i++)
                        value[i - 1] = value[i];
                    value[2] = '.';
                    Array.Reverse(value);
                    return (T)(object)new String(value).ToDecimal();
                }
            }
            else if (typeof(T) == typeof(DateTime) && !dateTime)
            {
                return (T)(object)InternalTryToDateTime(new String(buffer, 0, digits), false).GetValueOrDefault();                
            }
            else if (typeof(T) == typeof(DateTime) && dateTime)
            {
                return (T)(object)InternalTryToDateTime(new String(buffer, 0, digits), true).GetValueOrDefault();
            }
            else if (typeof(T) == typeof(TimeSpan))
            {
                return (T)(object)TimeSpan.ParseExact(new String(buffer, 0, digits), "HHmm", System.Globalization.CultureInfo.InvariantCulture);
            }
            else if (typeof(T) == typeof(DateTime?) && !dateTime)
            {
                return (T)(object)InternalTryToDateTime(new String(buffer, 0, digits), false);
            }
            else if (typeof(T) == typeof(DateTime?) && dateTime)
            {
                return (T)(object)InternalTryToDateTime(new String(buffer, 0, digits), true);
            }
            else if (typeof(T) == typeof(TimeSpan?))
            {
                var str = new String(buffer, 0, digits).Trim();
                if ((str.Length == 0) || (str == "    "))
                    return (T)(object)null;
                else
                    return (T)(object)TimeSpan.ParseExact(new String(buffer, 0, digits), "    ", System.Globalization.CultureInfo.InvariantCulture);
            }            
            else
                return (T)(object)null;
        }

        private static DateTime? InternalTryToDateTime(string value, bool containsTime)
        {
            DateTime result;
            if (containsTime)
            {
                if (DateTime.TryParseExact(value, "yyyyMMddHHmm", null, DateTimeStyles.None, out result))
                {
                    return result;
                }
            }
            else
            {
                if (DateTime.TryParseExact(value, "yyyyMMdd", null, DateTimeStyles.None, out result))
                {
                    return result;
                }
            }

            return null;
        }        
    }
}
