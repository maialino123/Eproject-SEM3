using DotNetOpenAuth.OAuth2;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Web;

namespace Eproject_Online_floral_delivery.common.googleLogin
{
    public class GoogleClient : WebServerClient
    {
        private static readonly AuthorizationServerDescription GoogleDescription =
        new AuthorizationServerDescription
        {
            TokenEndpoint = new Uri("https://accounts.google.com/o/oauth2/token"),
            AuthorizationEndpoint = new Uri("https://accounts.google.com/o/oauth2/auth"),
            ProtocolVersion = ProtocolVersion.V20
        };

        public const string ProfileEndpoint = "https://www.googleapis.com/oauth2/v1/userinfo";

        public const string ProfileScope = "https://www.googleapis.com/auth/userinfo.profile";
        public const string EmailScope = "https://www.googleapis.com/auth/userinfo.email";

        public GoogleClient()
            : base(GoogleDescription)
        {
        }
    }

    public class GoogleProfileAPI
    {
        public string email { get; set; }

        private static DataContractJsonSerializer jsonSerializer =
            new DataContractJsonSerializer(typeof(GoogleProfileAPI));

        public static GoogleProfileAPI Deserialize(Stream jsonStream)
        {
            try
            {
                if (jsonStream == null)
                {
                    throw new ArgumentNullException("jsonStream");
                }

                return (GoogleProfileAPI)jsonSerializer.ReadObject(jsonStream);
            }
            catch (Exception ex)
            {
                return new GoogleProfileAPI();
            }
        }
    }
}