using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Eproject_Online_floral_delivery.Models
{
    public class ItemModel
    {
        public string name { get; set; }
        public string currency { get; set; }
        public long price { get; set; }
        public int quantity { get; set; }
        public string sku { get; set; }
    }
}