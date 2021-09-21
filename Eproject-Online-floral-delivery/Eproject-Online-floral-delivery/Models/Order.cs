using Eproject_Online_floral_delivery.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Eproject_Online_floral_delivery.Models
{
    public class Order
    {
        public tbl_product Product { get; set; }
        public tbl_district District { get; set; }
        public tbl_ward Ward { get; set; }
        public long cartID { get; set; }
        public string image { get; set; }
        public int quantity { get; set; }
        public long districtID { get; set; }
        public long wardID { get; set; }
        public string address { get; set; }
        public long customerID { get; set; }
        public string fullName { get; set; }
        public string note { get; set; }
        public long messageID { get; set; }
        public string phone { get; set; }
    }
}