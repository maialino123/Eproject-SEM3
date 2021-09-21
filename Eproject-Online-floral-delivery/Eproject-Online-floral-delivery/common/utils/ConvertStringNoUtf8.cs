using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Eproject_Online_floral_delivery.common.utils
{
    public class ConvertStringNoUtf8
    {
        public static string Convert_Unsigned_string (string s)
        {
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string strFormD = s.Normalize(NormalizationForm.FormD);
            return regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }

        public static string Convert_String_HtmlMail(string html)
        {
            string htmlConvert = html.Replace('"', '"');
            string htmlNoSpace = htmlConvert.Trim(' ');
            return htmlNoSpace;
        }
    }
}