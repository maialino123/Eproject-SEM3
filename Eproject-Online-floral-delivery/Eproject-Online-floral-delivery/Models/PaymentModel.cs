using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Eproject_Online_floral_delivery.Models
{
    public class PaymentModel
    {
        public long cartID { get; set; }
        public long customerID { get; set; }
        public long promotionPrice { get; set; }
        public long productID { get; set; }
        public long messageID { get; set; }
        public long districtID { get; set; }
        public long unitPrice { get; set; }
        public string address { get; set; }
        public string note { get; set; }
        public string phone { get; set; }
        public int quantity { get; set; }
        public long wardID { get; set; }
        public string fullName { get; set; }
        public string currency { get; set; }
        public string productName { get; set; }
    }
}