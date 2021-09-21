

using System;
using System.Linq;
using System.Text;

namespace Eproject_Online_floral_delivery.common
{
    public class RandomInit
    {
        public static string GenerateNewRandomInt()
        {
            Random generator = new Random();
            String r = generator.Next(0, 1000000).ToString("D6");
            if (r.Distinct().Count() == 1)
            {
                r = GenerateNewRandomInt();
            }
            return r;
        }

        public static string GenerateNewRandomString()
        {
            StringBuilder stringBuilder = new StringBuilder(12);
            Random rd = new Random();
            char offset = 'a';
            char OFFSET = 'A';
            char limit = '0';

            const int letterOffset = 26;
            const int letterLimit = 10;

            for(var i = 0; i < 4; i++)
            {
                var @char = (char)rd.Next(offset, offset + letterOffset);
                stringBuilder.Append(@char);
            }

            for(var i = 0; i < 4; i++)
            {
                var @charLower = (char)rd.Next(OFFSET, OFFSET + letterOffset);
                stringBuilder.Append(@charLower);
            }

            for (var i = 0; i < 4; i++)
            {
                var @charLimit = (char)rd.Next(limit, limit + letterLimit);
                stringBuilder.Append(@charLimit);
            }
            return stringBuilder.ToString();
        }
    }
}