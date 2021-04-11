﻿namespace LookApp.Business.Identity
{
    public class JwtOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string Key { get; set; }
        public string TokenExpirationInHours { get; set; }
    }
}
