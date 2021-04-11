using LookApp.Business.Identity.Models;
using LookApp.Database.Models;
using System.Threading.Tasks;
using LanguageExt;
using LookApp.Business.Models;

namespace LookApp.Business.Identity
{
    public interface IAuthenticationService
    {
        Task<Either<RequestError, LoginUserResponse>> LoginAsync(LoginUserRequest loginUserRequest);

        Task<Either<RequestError, User>> RegisterAsync(RegisterUserRequest registerUserRequest);

        Task<Either<RequestError, User>> ChangePasswordAsync(ChangePasswordRequest changePasswordRequest);
    }
}
