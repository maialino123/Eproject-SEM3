using Eproject_Online_floral_delivery.common;
using Eproject_Online_floral_delivery.DAL;
using Eproject_Online_floral_delivery.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class SMSController : Controller
    {
        private GenericUnitOfWork _unitOfWork = new GenericUnitOfWork();
        private Eproject_FloralEntities DbEntities = new Eproject_FloralEntities();
        // GET: SMS
        public ActionResult Index()
        {
            return View();
        }
        
        [HttpPost]
        public JsonResult SendSMS(string phoneNumber)
        {
            try
            {
                string convertPhone = phoneNumber.Substring(1);
                string rd = RandomInit.GenerateNewRandomInt();
                if (phoneNumber == null)
                {
                    return Json(1, JsonRequestBehavior.AllowGet);
                }
                const string accountSID = "AC210c08123b832ff2fc52e42a42c2b21d";
                const string tokenID = "55e9ace7e5f29925f066b427c66371fc";

                TwilioClient.Init(accountSID, tokenID);

                var To = new PhoneNumber("+84" + convertPhone);

                var message = MessageResource.Create(
                    To, from: new PhoneNumber("+14086384832"), body: $"CODE : " + rd.ToLower()
                );
                return Json(rd, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(0, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult sendEmail(string email, string type)
        {
            if (email == null || type == null)
            {
                return Json(1, JsonRequestBehavior.AllowGet);
            }
            string rdPassword = "";
            if (type.Equals("password"))
            {
                rdPassword = RandomInit.GenerateNewRandomString();
            } else if(type.Equals("otp"))
            {
                rdPassword = RandomInit.GenerateNewRandomInt();
            }
            MailMessage mail = new MailMessage();
            mail.To.Add(email);
            mail.From = new MailAddress("Nguyenbatu10111@gmail.com");
            mail.Subject = "Online flower shop";
            string body = "<p style='background-color:aquamarine;padding: 20px;'>" + type +" : " + "<b>" + rdPassword + "</b>" + "</p>";
            mail.Body = body;
            mail.IsBodyHtml = true;
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "smtp.gmail.com";
            smtp.Port = 587;
            smtp.UseDefaultCredentials = true;
            smtp.Credentials = new System.Net.NetworkCredential("nguyenbatu10111@gmail.com", "ayrvgfovazutysjg");
            smtp.EnableSsl = true;
            smtp.Send(mail);
            return Json(rdPassword, JsonRequestBehavior.AllowGet);
        }
    }
}