using DotNetOpenAuth.OAuth2;
using Eproject_Online_floral_delivery.common;
using Eproject_Online_floral_delivery.common.googleLogin;
using Eproject_Online_floral_delivery.DAL;
using Eproject_Online_floral_delivery.Repository;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class LoginController : Controller
    {
        private GenericUnitOfWork _unitOfWork = new GenericUnitOfWork();
        private Eproject_FloralEntities DbEntities = new Eproject_FloralEntities();

        private static readonly GoogleClient googleClient = new GoogleClient
        {
            ClientIdentifier = "871588741118-a68639geh2d16ct5sp11relo1k47l4qn.apps.googleusercontent.com",
            ClientCredentialApplicator = ClientCredentialApplicator.PostParameter("EaSmmoMsFofX6oU7VXeEcCJ7")
        };
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        //Login with admin
        [HttpPost]
        public JsonResult Login(tbl_customer model)
        {
            if (model.userName == null || model.password == null)
            {
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            tbl_customer userModel = new tbl_customer
            {
                userName = model.userName,
                password = model.password
            };
            tbl_customer user = DbEntities.tbl_customer.Where(x => x.userName.Equals(userModel.userName)).Where(y => y.password.Equals(userModel.password)).FirstOrDefault();
            if (user == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            if (user.tbl_roles.roleID == 1)
            {
                Session["userName"] = user.userName;
                Session["passWord"] = user.password;
                var result = JsonConvert.SerializeObject(user, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            return Json("user", JsonRequestBehavior.AllowGet);
        }

        //Login with user
        [HttpPost]
        public JsonResult LoginUser(string email, string password)
        {
            if (email == null || password == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            var user = DbEntities.tbl_customer.Where(x => x.email.Equals(email)).FirstOrDefault();
            if (user == null)
            {
                return Json(0, JsonRequestBehavior.AllowGet);
            }
            else if (user.isActive == false)
            {
                return Json(-1, JsonRequestBehavior.AllowGet);
            }
            else if (BCrypt.Net.BCrypt.Verify(password, user.password) && user.roleID == 2)
            {
                string fullName = user.firstName + user.lastName;
                Session["fullName"] = fullName;
                Session["email"] = user.email;
                Session["customerID"] = user.customerID;
                var result = JsonConvert.SerializeObject(user, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(-2, JsonRequestBehavior.AllowGet);
            }
        }
        //Logout ajax
        [HttpPost]
        public JsonResult logout()
        {
            if(Session.Contents["userName"] != null)
            {
                //remove session
                Session["userName"] = null;
                Session["passWord"] = null;
            } else if(Session.Contents["fullName"] != null)
            {
                Session["fullName"] = null;
                Session["email"] = null;
            }
            return Json(1, JsonRequestBehavior.AllowGet);
        }
        //forgot password
        [HttpPost]
        public JsonResult checkRoleAccount(string email, string phoneNumber)
        {
            List<tbl_customer> list = new List<tbl_customer>();
            if(email != null)
            {
                var customer = DbEntities.tbl_customer.Where(x => x.email.Equals(email) && x.roleID == 2).FirstOrDefault();
                if(customer != null)
                {
                    list.Add(customer);
                }
            } else if(phoneNumber != null)
            {
                var customer = DbEntities.tbl_customer.Where(x => x.phoneNumber.Equals(phoneNumber) && x.roleID == 2).FirstOrDefault();
                if (customer != null)
                {
                    list.Add(customer);
                }
            }
            if(list.Count > 0)
            {
                var result = JsonConvert.SerializeObject(list, Formatting.Indented, new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            return Json(1, JsonRequestBehavior.AllowGet);
        }
        public ActionResult forgotPassword()
        {
            return View();
        }

        public ActionResult newPassword(long id)
        {
            ViewBag.customerID = id;
            return View();
        }

        [HttpPost]
        public JsonResult loginWithGoogle()
        {
            IAuthorizationState authorization = googleClient.ProcessUserAuthorization();
            if (authorization == null)
            {
                // Kick off authorization request
                // Google will redirect back here
                Uri uri = new Uri("https://localhost:44396/Login/loginWithGoogle");
                googleClient.RequestUserAuthorization(returnTo: uri,
                    scope: new[] { GoogleClient.ProfileScope, GoogleClient.EmailScope });
            }
            else
            {
                // authorization. we have the token and 
                // we just go to profile APIs to get email (and possibly other data)
                var request =
                    WebRequest.Create(
                        string.Format("{0}?access_token={1}",
                        GoogleClient.ProfileEndpoint,
                        Uri.EscapeDataString(authorization.AccessToken)));
                using (var response = request.GetResponse())
                {
                    using (var responseStream = response.GetResponseStream())
                    {
                        var profile = GoogleProfileAPI.Deserialize(responseStream);
                        if (profile != null &&
                            !string.IsNullOrEmpty(profile.email))
                            //FormsAuthentication.RedirectFromLoginPage(profile.email, false);
                            return Json(profile.email, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            return Json(1, JsonRequestBehavior.AllowGet);
        }
    }
}