using Eproject_Online_floral_delivery.common;
using Eproject_Online_floral_delivery.common.session;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery.Controllers
{
    public class BaseController : Controller
    {
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var session = (sessionLogin)Session[SystemContants.USER_SESSION];
            if(session == null)
            {
                filterContext.Result = new RedirectToRouteResult(new System.Web.Routing.RouteValueDictionary(new { controller = "Login", action = "Index"}));
            }
            base.OnActionExecuting(filterContext);
        }
    }
}