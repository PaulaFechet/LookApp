using System.Collections.Generic;
using LookApp.Business.Models;

namespace LookApp.API
{
    public static class ErrorConstants
    {
        public static Dictionary<RequestError, string> Messages = new Dictionary<RequestError, string>()
        {
            {RequestError.UserAlreadyExists, "This email is already in use."},
            {RequestError.PasswordFormatError, "The provided password does not follow the required format."},
            {RequestError.InvalidCredentials, "Incorrect username or password"}
        };
    }
}
