using Eproject_Online_floral_delivery.common;
using Eproject_Online_floral_delivery.common.utils;
using Eproject_Online_floral_delivery.DAL;
using Eproject_Online_floral_delivery.Models;
using Eproject_Online_floral_delivery.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class AdminController : Controller
    {
        private GenericUnitOfWork _unitOfWork = new GenericUnitOfWork();
        private Eproject_FloralEntities DbEntities = new Eproject_FloralEntities();

        public ActionResult Index()
        {
            if (Session.Contents["userName"] != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Login");
        }


        public ActionResult Categories()
        {
            if (Session.Contents["userName"] != null)
            {
                List<tbl_category> allCategories =
                 _unitOfWork.GetRepositoryInstance<tbl_category>()
                 .GetAllRecordsIQueryable()
                 .Where(x => x.isDelete == false).ToList();
                return View(allCategories);
            }
            return RedirectToAction("Index", "Login");
        }
        //GET: Category / getAll / ajax
        [HttpGet]
        public JsonResult CategoryAll()
        {
            List<tbl_category> allCategories =
                _unitOfWork.GetRepositoryInstance<tbl_category>()
                .GetAllRecordsIQueryable()
                .Where(x => x.isDelete == false).ToList();
            //Convert data table to data json
            var result = JsonConvert.SerializeObject(allCategories, Formatting.Indented,
                new JsonSerializerSettings
                {
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
        //POST: Category/ ADD Category
        [HttpPost]
        public JsonResult AddCategory(tbl_category Model)
        {
            //Remove utf-8 of category name if any
            string nameNotUTF8 = ConvertStringNoUtf8.Convert_Unsigned_string(Model.name);
            //mapping from json to c# class
            tbl_category categoryModel = new tbl_category
            {
                name = Model.name,
                //fix every space in the string to a "-" sign
                code = nameNotUTF8.Replace(" ", "-"),
                parentID = 1,
                isActive = Model.isActive,
                isDelete = false
            };

            //Looking to see if the directory is already in the database?
            tbl_category checkCategoryEmpty = DbEntities.tbl_category
                .Where(x => x.name.ToLower()
                .Equals(categoryModel.name.ToLower()))
                .FirstOrDefault();
            //If not yet proceed to add new and return json of data otherwise return null
            if (checkCategoryEmpty == null)
            {
                _unitOfWork.GetRepositoryInstance<tbl_category>().Add(categoryModel);
                return Json(categoryModel, JsonRequestBehavior.AllowGet);
            }
            ErrorMessage errorMessage = new ErrorMessage
            {
                name = "warning",
                messageError = "The category you want to add already exists!"
            };
            return Json(errorMessage, JsonRequestBehavior.AllowGet);
        }

        //POST / Category - ajax json
        [HttpPost]
        public JsonResult editCategory(tbl_category model)
        {

            //Remove utf-8 of category name if any
            string nameNotUTF8 = ConvertStringNoUtf8.Convert_Unsigned_string(model.name);
            //mapping from json to c# class
            tbl_category CategoryModel = new tbl_category
            {
                categoryID = model.categoryID,
                name = model.name,
                code = model.name.Replace(" ", "-"),
                parentID = 1,
                isActive = model.isActive,
                isDelete = false
            };
            //Looking to see if the directory is already in the database?
            var result = DbEntities.tbl_category.Count(x => x.name.ToLower().Equals(CategoryModel.name.ToLower()));
            //If not yet proceed to add new and return json of data otherwise return null
            if (result < 2)
            {
                _unitOfWork.GetRepositoryInstance<tbl_category>().Update(CategoryModel);
                return Json(CategoryModel, JsonRequestBehavior.AllowGet);
            }
            ErrorMessage errorMessage = new ErrorMessage
            {
                name = "Warning",
                messageError = "The category name you want to edit already exists!"
            };
            return Json(errorMessage, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult removeCategory(tbl_category model)
        {
            tbl_category categoryModel = new tbl_category
            {
                categoryID = model.categoryID
            };
            _unitOfWork.GetRepositoryInstance<tbl_category>().Remove(categoryModel);
            return Json(categoryModel, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Product()
        {
            if (Session.Contents["userName"] != null)
            {
                List<tbl_product> products = DbEntities.tbl_product.Include("tbl_category").ToList();
                return View(products);
            }
            return RedirectToAction("Index", "Login");
        }

        [HttpGet]
        public ActionResult addProduct()
        {
            if (Session.Contents["userName"] != null)
            {
                List<tbl_category> getAllCategory =
                _unitOfWork.GetRepositoryInstance<tbl_category>()
                .GetAllRecordsIQueryable().Where(x => x.isDelete == false).ToList();
                return View(getAllCategory);
            }
            return RedirectToAction("Index", "Login");
        }
        //POST: add product / ajax - json
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult addProduct(tbl_product[] model)
        {
            if (model != null)
            {
                DateTime nowDate = DateTime.Now;
                foreach (var item in model)
                {
                    if (!item.name.Equals("No entries found") && item.quantity != null)
                    {
                        tbl_product _productModel = new tbl_product
                        {
                            name = item.name,
                            price = item.price,
                            priceSale = item.priceSale,
                            dayStartSale = item.dayStartSale,
                            dayEndSale = item.dayEndSale,
                            isActive = item.isActive,
                            isFeatured = true,
                            createdDate = nowDate,
                            modifiedDate = item.modifiedDate,
                            quantity = item.quantity,
                            metaTitle = item.metaTitle,
                            description = item.description,
                            metaKeyword = ConvertStringNoUtf8.Convert_Unsigned_string(item.name + item.price + item.categoryID),
                            countView = 0,
                            categoryID = item.categoryID
                        };
                        _unitOfWork.GetRepositoryInstance<tbl_product>().Add(_productModel);
                    }
                }
                return Json("succsess!", JsonRequestBehavior.AllowGet);
            }
            return Json("error!", JsonRequestBehavior.AllowGet);
        }


        public ActionResult updateProduct(long? id)
        {
            if (Session.Contents["userName"] != null)
            {
                if (id == null)
                {
                    return PartialView("_page404");
                }
                tbl_product product = DbEntities.tbl_product.Include("tbl_category").Where(x => x.productID == id).FirstOrDefault();
                if (product == null)
                {
                    return PartialView("_page404");
                }
                return View(product);
            }
            return RedirectToAction("Index", "Login");
        }

        [HttpPost]
        public JsonResult updateProductData(tbl_product product)
        {
            DateTime nowDate = DateTime.Now;
            tbl_product _product = new tbl_product
            {
                productID = product.productID,
                name = product.name,
                price = product.price,
                priceSale = product.priceSale,
                dayStartSale = product.dayStartSale,
                dayEndSale = product.dayEndSale,
                isActive = product.isActive,
                isFeatured = true,
                createdDate = product.createdDate,
                modifiedDate = nowDate,
                quantity = product.quantity,
                metaTitle = product.metaTitle,
                description = product.description,
                metaKeyword = product.metaKeyword,
                countView = product.countView,
                categoryID = product.categoryID
            };
            _unitOfWork.GetRepositoryInstance<tbl_product>().Update(_product);
            return Json(_product, JsonRequestBehavior.AllowGet);
        }

        //Remove Product
        [HttpPost]
        public JsonResult removeProduct(long[] id)
        {
            if (id != null)
            {
                foreach (var item in id)
                {
                    var imageProduct = DbEntities.tbl_imageList.Where(x => x.productID == item).ToList();
                    var product = DbEntities.tbl_product.Where(x => x.productID == item).FirstOrDefault();
                    foreach (var image in imageProduct)
                    {
                        DbEntities.tbl_imageList.Remove(image);
                        DbEntities.SaveChanges();
                    }
                    DbEntities.tbl_product.Remove(product);
                    DbEntities.SaveChanges();
                }
                return Json("success", JsonRequestBehavior.AllowGet);
            }
            return Json("error", JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public ActionResult addMoreImage(long id)
        {
            tbl_product product = DbEntities.tbl_product.Find(id);
            return View(product);
        }

        [HttpGet]
        public JsonResult getAllImage(long id)
        {
            List<tbl_imageList> allImage = _unitOfWork.GetRepositoryInstance<tbl_imageList>().GetAllRecordsIQueryable().Where(x => x.productID == id).ToList();
            return Json(allImage, JsonRequestBehavior.AllowGet);
        }


        //Upload Image
        [HttpPost] // for multiupload use '[]'
        public ActionResult UploadProductImages(long id, HttpPostedFileBase[] productpictures)
        {
            string uploadFullPath = Server.MapPath("/MyImages");
            foreach (var pp in productpictures)
            {
                var idmax = DbEntities.tbl_imageList.OrderByDescending(x => x.imageListID).FirstOrDefault();
                //image/jpeg
                string ext = pp.ContentType.Split('/')[1];
                tbl_imageList productPicture = new tbl_imageList();
                string filename = "";  //f_1d1d1d-ddd.png
                if (idmax != null)
                {
                    filename = $"f_{idmax.imageListID + 1}";
                }
                else
                {
                    filename = $"f_{0}.{ext}";
                }
                string fullFilePath = uploadFullPath + "/" + filename + "." + ext;
                pp.SaveAs(fullFilePath);

                productPicture.name = filename;
                productPicture.extendsion = "." + ext;
                productPicture.productID = id;

                DbEntities.tbl_imageList.Add(productPicture);
                DbEntities.SaveChanges();
            }
            return new HttpStatusCodeResult(HttpStatusCode.OK);
        }

        //GET image
        public ActionResult getImages(long id)
        {
            if (Session.Contents["userName"] != null)
            {
                List<tbl_imageList> images = DbEntities.tbl_imageList.Where(x => x.productID == id).ToList();
                return PartialView("_ProductPictures", images);
            }
            return RedirectToAction("Index", "Login");
        }

        [HttpPost]
        //POST delete image
        public JsonResult RemoveProductPicture(string name)
        {
            var image = DbEntities.tbl_imageList.Where(x => x.name.ToLower().Equals(name.ToLower())).FirstOrDefault();
            if (image != null)
            {
                DbEntities.tbl_imageList.Remove(image);
                DbEntities.SaveChanges();
                return Json("sucess", JsonRequestBehavior.AllowGet);
            }
            return Json("error", JsonRequestBehavior.AllowGet);
        }


        //ORDER action 
        public ActionResult SystemOrder()
        {
            if (Session.Contents["userName"] != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Login");
        }

        [HttpGet]
        public JsonResult Orders()
        {
            //var orders = DbEntities.tbl_orderDetail.Join(DbEntities.tbl_order,
            //    detail => detail.orderID, order => order.orderID,
            //    (detail, order) => new
            //    {
            //        detail, order
            //    }).OrderByDescending(x => x.order.dateOfStart).ToList();

            var orders = DbEntities.tbl_order.OrderByDescending(x => x.dateOfStart).ToList();

            if (orders.Count == 0)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }

            //Convert data table to data json
            var result = JsonConvert.SerializeObject(orders, Formatting.Indented,
                new JsonSerializerSettings
                {
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
    }
}