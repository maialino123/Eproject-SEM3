using Eproject_Online_floral_delivery.common.payment;
using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class PaymentController : Controller
    {
        // GET: Payment
        public ActionResult PaymentWithPayPal()
        {
            //Initialize APIContext
            APIContext apiContext = PaypalConfiguration.GetAPIContext();
            try
            {
                string PayerId = Request.Params["PayerID"];
                if(string.IsNullOrEmpty(PayerId))
                {
                    string baseURI = Request.Url.Scheme + "://" + Request.Url.Authority + "PaymentWithPayPal/Paypa";
                }
            } catch(Exception )
            {

            }
            return View();
        }
    }
}