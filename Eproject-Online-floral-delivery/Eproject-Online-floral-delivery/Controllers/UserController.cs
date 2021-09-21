using Eproject_Online_floral_delivery.common;
using Eproject_Online_floral_delivery.common.utils;
using Eproject_Online_floral_delivery.DAL;
using Eproject_Online_floral_delivery.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class UserController : Controller
    {
        private GenericUnitOfWork _unitOfWork = new GenericUnitOfWork();
        private Eproject_FloralEntities DbEntities = new Eproject_FloralEntities();
        // GET: User
        public ActionResult Index()
        {
            if(Session.Contents["userName"] != null)
            {
                return View();
            }
            return RedirectToAction("Index", "Login");
        }

        [HttpPost]
        public JsonResult getUser(string userName)
        {
            tbl_customer customer = DbEntities.tbl_customer.Where(x => x.userName.Equals(userName)).FirstOrDefault();
            if(customer == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var result = JsonConvert.SerializeObject(customer, Formatting.Indented, 
            new JsonSerializerSettings {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult getAllRoles()
        {
            List<tbl_roles> roles = _unitOfWork.GetRepositoryInstance<tbl_roles>().GetAllRecordsIQueryable().ToList();
            if(roles == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var results = JsonConvert.SerializeObject(roles, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return Json(results, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult updateProfile(tbl_customer model)
        {
            if(model == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            DateTime nowDate = DateTime.Now;
            tbl_customer customerModel = new tbl_customer
            {
                customerID = model.customerID,
                firstName = model.firstName,
                lastName = model.lastName,
                birthDay = model.birthDay,
                gender = model.gender,
                phoneNumber = model.phoneNumber,
                address = model.address,
                email = model.email,
                password = model.password,
                isActive = model.isActive,
                isDelete = model.isDelete,
                createdDate = model.createdDate,
                ModifiedDate = nowDate,
                tokenID = model.tokenID,
                roleID = model.roleID,
                userName = model.userName
            };
            _unitOfWork.GetRepositoryInstance<tbl_customer>().Update(customerModel);
            return Json(customerModel, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public JsonResult deleteProfile(long customerID)
        {
            if(customerID == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            tbl_customer customer = DbEntities.tbl_customer.Find(customerID);
            if(customer != null)
            {
                _unitOfWork.GetRepositoryInstance<tbl_customer>().Remove(customer);
                return Json(customer, JsonRequestBehavior.AllowGet);
            }
            return Json(1, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult resetPassword(long customerID ,string newPassword)
        {
            if(customerID == null || newPassword == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var userNameCustom = Session.Contents["userName"];
            tbl_customer model = DbEntities.tbl_customer.Find(customerID);
            if(model == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            DateTime nowDate = DateTime.Now;
            tbl_customer newCustomer = new tbl_customer
            {
                customerID = model.customerID,
                firstName = model.firstName,
                lastName = model.lastName,
                birthDay = model.birthDay,
                gender = model.gender,
                phoneNumber = model.phoneNumber,
                address = model.address,
                email = model.email,
                password = BCrypt.Net.BCrypt.HashPassword(newPassword),
                isActive = model.isActive,
                isDelete = model.isDelete,
                createdDate = model.createdDate,
                ModifiedDate = nowDate,
                tokenID = model.tokenID,
                roleID = model.roleID,
                userName = model.userName
            };
            _unitOfWork.GetRepositoryInstance<tbl_customer>().Update(newCustomer);
            return Json(newCustomer, JsonRequestBehavior.AllowGet);
        }

        public ActionResult SignIn()
        {
            return View();
        }

        //sign up user
        [HttpPost]
        public JsonResult SignUp(tbl_customer model)
        {
            if(model == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            DateTime nowDate = DateTime.Now;
            SystemContants.passwordHash = BCrypt.Net.BCrypt.HashPassword(model.password);
            tbl_customer customer = new tbl_customer
            {
                firstName = model.firstName,
                lastName = model.lastName,
                birthDay = model.birthDay,
                gender = model.gender,
                phoneNumber = model.phoneNumber,
                address = model.address,
                email = model.email,
                password = SystemContants.passwordHash,
                isActive = true,
                isDelete = false,
                createdDate = nowDate,
                ModifiedDate = null,
                tokenID = null,
                roleID = 2,
                userName = "user"
            };
            _unitOfWork.GetRepositoryInstance<tbl_customer>().Add(customer);
            return Json(customer, JsonRequestBehavior.AllowGet);
        }

        //check email user defind
        [HttpPost]
        public JsonResult checkEmail(string email)
        {
            if(email == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var result = DbEntities.tbl_customer.Where(x => x.email.ToLower().Equals(email.ToLower())).FirstOrDefault();
            if(result == null)
            {
                return Json(0, JsonRequestBehavior.AllowGet);
            }
            var resultJson = JsonConvert.SerializeObject(result, Formatting.Indented, new JsonSerializerSettings {
                            ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult checkPhoneNumber(string phoneNumber)
        {
            if (phoneNumber == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var result = DbEntities.tbl_customer.Where(x => x.phoneNumber.ToLower().Equals(phoneNumber.ToLower())).FirstOrDefault();
            if (result == null)
            {
                return Json(0, JsonRequestBehavior.AllowGet);
            }
            var resultJson = JsonConvert.SerializeObject(result, Formatting.Indented, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }
    }
}