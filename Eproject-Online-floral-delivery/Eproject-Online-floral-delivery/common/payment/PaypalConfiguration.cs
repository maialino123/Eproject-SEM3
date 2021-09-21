using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Eproject_Online_floral_delivery.common.payment
{
    // config payment paypal
    public class PaypalConfiguration
    {
        public readonly static string clientId;
        public readonly static string clientSecret;


        static PaypalConfiguration()
        {
            var config = getConfig();
            clientId = config["clientId"];
            clientSecret = config["clientSecret"];
        }

        private static Dictionary<string, string> getConfig()
        {
            return PayPal.Api.ConfigManager.Instance.GetProperties();
        }

        //Get Token
        private static string getAccessToken()
        {
            string accessToken = new OAuthTokenCredential(clientId, clientSecret,getConfig()).GetAccessToken();
            return accessToken;
        }

        public static APIContext GetAPIContext()
        {
            APIContext apiContext = new APIContext(getAccessToken());
            apiContext.Config = getConfig();
            return apiContext;
        }
    }
}