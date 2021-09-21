using Eproject_Online_floral_delivery.DAL;
using Eproject_Online_floral_delivery.Models;
using Eproject_Online_floral_delivery.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class HomeController : Controller
    {
        private GenericUnitOfWork _unitOfWork = new GenericUnitOfWork();
        private Eproject_FloralEntities DbEntities = new Eproject_FloralEntities();
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult error404()
        {
            return View();
        }

        //Get product top View
        [HttpGet]
        public JsonResult getAllProductByView()
        {
            var products = DbEntities.tbl_product.OrderBy(x => x.countView).ToList();
            if (products == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(products, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }

        public ActionResult Cart(long customerID)
        {
            ViewBag.customerID = customerID;
            return View();
        }

        //getting all item cart
        [HttpPost]
        public JsonResult getItemAll(long customerID)
        {
            var products = DbEntities.tbl_orderDetail.Join(DbEntities.tbl_order,
                orderDetail => orderDetail.orderID,
                order => order.orderID,
                (orderDetail, order) => new
                {
                    orderDetail,
                    order
                }).OrderByDescending(x => x.orderDetail.orderDetailID)
                .Where(x => x.order.customerID == customerID)
                .Select(x => x.orderDetail).ToList();
            if (products == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(products, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }

        //Add to cart
        [HttpPost]
        public JsonResult addToCart(long productID, int quantity)
        {
            var fullName = Session.Contents["fullName"];

            if (fullName != null)
            {
                //get image 
                var imageProduct = DbEntities.tbl_imageList.Where(x => x.productID == productID).ToList();

                var pathImage = imageProduct[0].name + imageProduct[0].extendsion;

                var customerID = Session.Contents["customerID"];

                //user
                var user = DbEntities.tbl_customer.Find(customerID);

                //get cart
                var cartCurrent = DbEntities.tbl_cart.Where(x => x.productID == productID).FirstOrDefault();

                DateTime nowDate = DateTime.Now;
                if (cartCurrent == null)
                {
                    tbl_cart cart = new tbl_cart
                    {
                        productID = productID,
                        image = pathImage,
                        quantity = 1,
                        districtID = 1,
                        wardID = 1,
                        address = user.address,
                        customerID = (long)customerID,
                        createdDate = nowDate
                    };
                    _unitOfWork.GetRepositoryInstance<tbl_cart>().Add(cart);
                    return Json(cart, JsonRequestBehavior.AllowGet);
                } else
                {
                    tbl_cart cart = new tbl_cart
                    {
                        cartID = cartCurrent.cartID,
                        productID = cartCurrent.productID,
                        image = cartCurrent.image,
                        quantity = cartCurrent.quantity + 1,
                        districtID = cartCurrent.districtID,
                        wardID = cartCurrent.wardID,
                        address = cartCurrent.address,
                        customerID = cartCurrent.customerID,
                        createdDate = nowDate
                    };
                    _unitOfWork.GetRepositoryInstance<tbl_cart>().Update(cart);
                    return Json(cart, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(0, JsonRequestBehavior.AllowGet);
        }

        //get items cart
        [HttpPost]
        public JsonResult getItemCart(long customerID)
        {
            var carts = DbEntities.tbl_cart.OrderBy(x => x.createdDate).Where(x => x.customerID == customerID).ToList();
            if(carts == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            } else
            {
                List<Order> order = new List<Order>();
                foreach(var item in carts)
                {
                    var product = DbEntities.tbl_product.Find(item.productID);
                    var district = DbEntities.tbl_district.Find(item.districtID);
                    var ward = DbEntities.tbl_ward.Find(item.wardID);
                    Order model = new Order
                    {
                        Product = product,
                        District = district,
                        Ward = ward,
                        cartID = item.cartID,
                        image = item.image,
                        quantity = (int)item.quantity,
                        districtID = (long)item.districtID,
                        wardID = (long)item.wardID,
                        address = item.address,
                        customerID = (long)item.customerID
                    };
                    order.Add(model);
                }
                var results = JsonConvert.SerializeObject(order, Formatting.Indented, new JsonSerializerSettings {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return new JsonResult()
                {
                    Data = results,
                    ContentType = "application/json",
                    ContentEncoding = System.Text.Encoding.UTF8,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
            }
        }

        //update items cart
        [HttpPost]
        public JsonResult updateItemCart(PaymentModel[] model)
        {
            if(model == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            List<PaymentModel> listPayment = new List<PaymentModel>();
            foreach(var item in model)
            {
                //get cart
                var cart = DbEntities.tbl_cart.Find(item.cartID);
               
                if(cart != null)
                {
                    //get product
                    var product = DbEntities.tbl_product.Find(cart.productID);
                    //get price
                    var priceProduct = (product.priceSale == 0 ? product.price : product.priceSale);                    
                    PaymentModel payment = new PaymentModel
                    {
                        cartID = item.cartID,
                        customerID = (long)cart.customerID,
                        productID = (long)cart.productID,
                        promotionPrice = (long)((long)product.priceSale == 0 ? product.price : product.priceSale),
                        unitPrice = (long)(item.quantity * priceProduct),
                        messageID = item.messageID,
                        districtID = (long)cart.districtID,
                        address = cart.address,
                        wardID = (long)cart.wardID,
                        note = item.note,
                        phone = item.phone,
                        quantity = item.quantity,
                        fullName = item.fullName,
                        productName = product.name
                    };
                    listPayment.Add(payment);
                }
            }
            Session["cart"] = listPayment;
            return Json(0, JsonRequestBehavior.AllowGet);
        }

        //Remove orderDetail Item
        [HttpPost]
        public JsonResult removeItem(long[] cartID)
        {
            foreach(var item in cartID)
            {
                var cart = DbEntities.tbl_cart.Find(item);
                if (cart != null)
                {
                    DbEntities.tbl_cart.Remove(cart);
                    DbEntities.SaveChanges();
                    
                } else
                {
                    return Json(1, JsonRequestBehavior.AllowGet);
                }
            }
            return Json(0, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult getAllDistrict()
        {
            var districts = _unitOfWork.GetRepositoryInstance<tbl_district>().GetAllRecordsIQueryable();
            if (districts == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(districts, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }

        [HttpPost]
        public JsonResult addAddressOrderDetail(long cartID, long districtID, long wardID, string address)
        {
            var cart = DbEntities.tbl_cart.Find(cartID);
            if (cart == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }

            tbl_cart model = new tbl_cart
            {
                cartID = cartID,
                productID = cart.productID,
                image = cart.image,
                quantity = cart.quantity,
                districtID = districtID,
                wardID = wardID,
                address = address,
                customerID = cart.customerID,
                createdDate = cart.createdDate
            };
            _unitOfWork.GetRepositoryInstance<tbl_cart>().Update(model);
            return Json(model, JsonRequestBehavior.AllowGet);
        }

        //get user
        [HttpPost]
        public JsonResult getUserByID(long customerID)
        {
            var user = DbEntities.tbl_customer.Find(customerID);
            if(user == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var result = JsonConvert.SerializeObject(user, Formatting.Indented, new JsonSerializerSettings {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = result,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }

        //get all message
        [HttpGet]
        public JsonResult getAllMessage()
        {
            var messages = _unitOfWork.GetRepositoryInstance<tbl_message>().GetAllRecordsIQueryable();
            if(messages == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(messages, Formatting.Indented, new JsonSerializerSettings {
                        ReferenceLoopHandling  = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }


        //view product detail
        public ActionResult ProductDetail(long productID)
        {
            ViewBag.productID = productID;
            return View();
        }

        //get product by id
        [HttpPost]
        public JsonResult ProductDetailResult(long productID)
        {
            var product = DbEntities.tbl_product.Find(productID);

            if(product == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }

            tbl_product model = new tbl_product
            {
                productID = product.productID,
                name = product.name,
                price = product.price,
                priceSale = product.priceSale,
                dayStartSale = product.dayStartSale,
                dayEndSale = product.dayEndSale,
                image = product.image,
                isActive = product.isActive,
                isFeatured = product.isFeatured,
                createdDate = product.createdDate,
                modifiedDate = product.modifiedDate,
                quantity = product.quantity,
                metaTitle = product.metaTitle,
                description = product.description,
                metaKeyword = product.metaKeyword,
                countView = product.countView + 1,
                categoryID = product.categoryID
            };
            _unitOfWork.GetRepositoryInstance<tbl_product>().Update(model);
            var results = JsonConvert.SerializeObject(product, Formatting.Indented, new JsonSerializerSettings {
                        ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });

            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }


        public ActionResult Products()
        {
            return View();
        }

        //redirect our products
        [HttpGet]
        public JsonResult ourProduct()
        {
            var products = DbEntities.tbl_product.OrderBy(x => x.price).ToList();
            if(products.Count == 0)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(products, Formatting.Indented, new JsonSerializerSettings {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }

        //getting product by price
        [HttpPost]
        public JsonResult productByPrice(long min, long max)
        {
            var products = DbEntities.tbl_product.Where(x => x.price > min && x.price < max).ToList();
            if(products.Count == 0)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(products, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }


        [HttpPost]
        public JsonResult getProductByCategoryID(long categoryID)
        {
            var products = DbEntities.tbl_product.Where(x => x.categoryID == categoryID).ToList();
            if(products == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(products, Formatting.Indented, new JsonSerializerSettings {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return new JsonResult()
            {
                Data = results,
                ContentType = "application/json",
                ContentEncoding = System.Text.Encoding.UTF8,
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = Int32.MaxValue
            };
        }

        //sort product by price
        [HttpPost]
        public JsonResult sortProductByPrice(string type)
        {
            if (type == "desc")
            {
                var productsDesc = DbEntities.tbl_product.OrderByDescending(x => x.price).ToList();
                var results1 = JsonConvert.SerializeObject(productsDesc, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return new JsonResult()
                {
                    Data = results1,
                    ContentType = "application/json",
                    ContentEncoding = System.Text.Encoding.UTF8,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
            } else
            {
                var products = DbEntities.tbl_product.OrderBy(x => x.price).ToList();
                var results = JsonConvert.SerializeObject(products, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return new JsonResult()
                {
                    Data = results,
                    ContentType = "application/json",
                    ContentEncoding = System.Text.Encoding.UTF8,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
            }
        }
    }
}