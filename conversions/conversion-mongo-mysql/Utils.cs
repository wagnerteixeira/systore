using System;
using System.Collections.Generic;
using System.Text;
using System.Text.RegularExpressions;

namespace conversion_mongo_mysql
{
    public static class Utils
    {

        public static string OnlyNumbers(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;
            Regex regexObj = new Regex(@"[^\d]");
            return regexObj.Replace(value, "");
        }
    }
}
