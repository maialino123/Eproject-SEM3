using System.Web;
using System.Web.Mvc;

namespace Eproject_Online_floral_delivery
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
