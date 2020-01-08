using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Systore.Services
{
    public static class FormatExtensions
    {
        public static string StringFormat(this string value, int digits)
        {
            string ret = string.Format($"{{0,-{digits}}}", value);
            if (ret.Length > digits)
                throw new NotSupportedException("Valor maior que o permitido");
            return ret;
        }

        public static string StringFormat(this int value, int digits)
        {
            string ret = value.ToString($"D{digits}");
            if (ret.Length > digits)
                throw new NotSupportedException("Valor maior que o permitido");
            return ret;
        }

        public static string StringFormat(this int? value, int digits)
        {
            if (value.HasValue)
            {
                string ret = value.Value.ToString($"D{digits}");
                if (ret.Length > digits)
                    throw new NotSupportedException("Valor maior que o permitido");
                return ret;
            }
            else
                return string.Format($"{{0,-{digits}}}", "");

        }

        public static string StringFormat(this long value, int digits)
        {
            string ret = value.ToString($"D{digits}");
            if (ret.Length > digits)
                throw new NotSupportedException("Valor maior que o permitido");
            return ret;
        }

        public static string StringFormat(this long? value, int digits)
        {
            if (value.HasValue)
            {
                string ret = value.Value.ToString($"D{digits}");
                if (ret.Length > digits)
                    throw new NotSupportedException("Valor maior que o permitido");
                return ret;
            }
            else
                return string.Format($"{{0,-{digits}}}", "");

        }

        public static string StringFormat(this decimal value, int digits)
        {
            string ret = ((long)Math.Round((Math.Round(value, 2) * 100), 0)).ToString($"D{digits}");
            if (ret.Length > digits)
                throw new NotSupportedException("Valor incorreto");
            return ret;
        }

        public static string StringFormat(this decimal? value, int digits)
        {
            if (value.HasValue)
            {
                string ret = ((long)Math.Round((Math.Round(value.Value, 2) * 100), 0)).ToString($"D{digits}");
                if (ret.Length > digits)
                    throw new NotSupportedException("Valor incorreto");
                return ret;
            }
            else
                return string.Format($"{{0,-{digits}}}", "");
        }

        public static string StringFormat(this DateTime value, bool dateTime)
        {
            if (dateTime)
                return value.ToString("yyyyMMddHHmm");
            else
                return value.ToString("yyyyMMdd");
        }

        public static string StringFormat(this TimeSpan value)
        {
            return value.ToString("HHmm");
        }

        public static string StringFormat(this DateTime? value, bool dateTime)
        {
            if (dateTime)
                return value.HasValue ? value.Value.ToString("yyyyMMddHHmm") : "            ";
            else
                return value.HasValue ? value.Value.ToString("yyyyMMdd") : "        ";
        }

        public static string StringFormat(this TimeSpan? value)
        {
            return value.HasValue ? value.Value.ToString("HHmm") : "    ";
        }

        public static string StringFormat(this DateTime dateValue, TimeSpan hourValue)
        {
            return $"{dateValue.ToString("yyyyMMdd")}{hourValue.ToString("HHmm")}";
        }

        public static string StringFormat(this DateTime? dateValue, TimeSpan? hourValue)
        {
            string ret = "";

            if (dateValue.HasValue)
                return ret = dateValue.Value.ToString("yyyyMMdd");
            else
                ret = "        ";

            if (hourValue.HasValue)
                ret += hourValue.Value.ToString("HHmm");
            else
                ret += "    ";

            return ret;
        }

        public static short ToShort(this string value)
        {
            short.TryParse(value, out short result);

            return result;
        }

        public static int ToInt(this string value)
        {
            int.TryParse(value, out int result);

            return result;
        }

        public static long ToLong(this string value)
        {
            long.TryParse(value, out long result);

            return result;
        }

        public static decimal ToDecimal(this string value)
        {

            decimal.TryParse(value, NumberStyles.AllowDecimalPoint, CultureInfo.InvariantCulture, out decimal result);

            return result;
        }

        public static bool ToBoolean(this string value)
        {
            bool.TryParse(value, out bool result);

            return result;
        }

        public static DateTime? TryToDateTime(this string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            value = value.Trim();

            string year = (value.Split(' ')[0].Length < 10 ? "yy" : "yyyy");

            DateTime result;

            if (value.Contains("/"))
            {
                if (DateTime.TryParseExact(value, $"dd/MM/{year} HH:mm:ss,fff".Truncate(value.Length), null, DateTimeStyles.None, out result))
                {
                    return result;
                }
            }

            if (value.Contains("-"))
            {
                if (DateTime.TryParseExact(value, $"{year}-MM-dd HH:mm:ss.fff".Truncate(value.Length), null, DateTimeStyles.None, out result))
                {
                    return result;
                }
            }

            return null;
        }

        public static DateTime ToDateTime(this string value)
        {
            return TryToDateTime(value).GetValueOrDefault();
        }

        public static string Truncate(this string value, int maxLength)
        {
            if (value == null || value.Length <= maxLength)
                return value;
            else
                return value.Substring(0, maxLength);
        }

        public static bool EqualsIgnoreCase(this string a, string b)
        {
            return string.Equals(a, b, StringComparison.CurrentCultureIgnoreCase);
        }
    }
}
