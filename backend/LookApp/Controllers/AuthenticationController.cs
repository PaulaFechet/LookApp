using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using LookApp.API.Extensions;
using LookApp.Business.Identity;
using LookApp.Business.Identity.Models;
using Microsoft.AspNetCore.Authorization;

namespace LookApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
         private readonly IAuthenticationService _authenticationService;

        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterUserRequest registerUserRequest)
        {
            var result = await _authenticationService.RegisterAsync(registerUserRequest);
            if (result.IsLeft)
            {
                var requestError = result.GetLeft();
                return BadRequest(ErrorConstants.Messages[requestError]);
            }

            var createdUser = result.GetRight();

            return Created(createdUser.Id.ToString(), null);
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginUserRequest loginUserRequest)
        {
            var result = await _authenticationService.LoginAsync(loginUserRequest);
            if (result.IsLeft)
            {
                var requestError = result.GetLeft();
                return BadRequest(ErrorConstants.Messages[requestError]);
            }

            var loginResponse = result.GetRight();

            return Ok(loginResponse);
        }

        [HttpPost("changePassword")]
        [Authorize]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordRequest changePasswordRequest)
        {
            var result = await _authenticationService.ChangePasswordAsync(changePasswordRequest);
            if (result.IsLeft)
            {
                var requestError = result.GetLeft();
                return BadRequest(ErrorConstants.Messages[requestError]);
            }

            var changePasswordResponse = result.GetRight();

            return Ok(changePasswordResponse);
        }
    }
}
