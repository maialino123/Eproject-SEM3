using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Eproject_Online_floral_delivery.common.session
{
    public class sessionLogin
    {
        public long id { get; set; }
        public string userName { get; set; }
        public string address { get; set; }
        public string city { get; set; }
        public string district { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }
    }
}