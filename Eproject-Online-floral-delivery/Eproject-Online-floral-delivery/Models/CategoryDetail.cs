using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery.Models
{
    public class CategoryDetail
    {
        public long categoryID { get; set; }
        [Required(ErrorMessage = "Category Name is Required!")]
        [StringLength(150, ErrorMessage = "Minimum 3 and maximum 150 characters are allwed!",MinimumLength = 3)]
        public string name { get; set; }
        public string code { get; set; }
        public Nullable<int> parentID { get; set; }
        public Nullable<bool> isActive { get; set; }
        public Nullable<bool> isDelete { get; set; }
    }

    public class ProductDetail
    {
        public long productID { get; set; }
        [Required(ErrorMessage = "Product Name is Required!")]
        [StringLength(150, ErrorMessage = "Minimum 3 and maximum 150 characters are allwed",MinimumLength = 3)]
        public string name { get; set; }
        [Required]
        [Range(typeof(double), "1000","999999999", ErrorMessage = "Invalid Price")]
        public Nullable<double> price { get; set; }
        public Nullable<double> priceSale { get; set; }
        public Nullable<System.DateTime> dayStartSale { get; set; }
        public Nullable<System.DateTime> dayEndSale { get; set; }
        public string image { get; set; }
        public Nullable<bool> isActive { get; set; }
        public Nullable<bool> isFeatured { get; set; }
        public Nullable<System.DateTime> createdDate { get; set; }
        public Nullable<System.DateTime> modifiedDate { get; set; }
        [Required]
        [Range(typeof(int), "1", "9999",ErrorMessage = "Invalid Quantity!")]
        public Nullable<int> quantity { get; set; }
        [Required(ErrorMessage = "MetaTitle is Required!")]
        [StringLength(500, ErrorMessage ="Minimum 10 and maximum 500 characters are allwed", MinimumLength = 10)]
        public string metaTitle { get; set; }
        [Required(ErrorMessage = "Description is Required!")]
        public string description { get; set; }
        public string metaKeyword { get; set; }
        public Nullable<int> countView { get; set; }
        [Required(ErrorMessage = "Select a category for the product!")]
        public long categoryID { get; set; }
        public SelectList Category { get; set; }
    }
}