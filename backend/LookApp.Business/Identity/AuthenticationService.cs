using LanguageExt;
using LookApp.Business.Identity.Models;
using LookApp.Database.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using LookApp.Business.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LookApp.Business.Identity
{
    public class AuthenticationService : IAuthenticationService
    {
        private readonly LookAppContext _context;
        private readonly JwtOptions _jwtConfiguration;
        private readonly IPasswordHasher _passwordHasher;

        public AuthenticationService(
            LookAppContext context,
            IOptions<JwtOptions> jwtOptions, 
            IPasswordHasher passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _jwtConfiguration = jwtOptions.Value;
        }

        public async Task<Either<RequestError, User>> RegisterAsync(RegisterUserRequest registerUserRequest)
        {
            var isUserAlreadyRegistered = await _context.Users.AnyAsync(u => u.Email == registerUserRequest.Email);
            if (isUserAlreadyRegistered)
            {
                return RequestError.UserAlreadyExists;
            }

            var isPasswordValid = Regex.IsMatch(registerUserRequest.Password, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,15}$");
            if (!isPasswordValid)
            {
                return RequestError.PasswordFormatError;
            }

            var newUser = new User
            {
                Id = 0,
                Email = registerUserRequest.Email,
                Name = registerUserRequest.Username,
                Password = _passwordHasher.CreateHash(registerUserRequest.Password)
            };

            await _context.Users.AddAsync(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }

        public async Task<Either<RequestError, LoginUserResponse>> LoginAsync(LoginUserRequest loginUserRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginUserRequest.Email);
            if (user == null)
            {
                return RequestError.InvalidCredentials;
            }

            var isPasswordValid = _passwordHasher.IsHashMatching(user.Password, loginUserRequest.Password);
            if (!isPasswordValid)
            {
                return RequestError.InvalidCredentials;
            }

            return GenerateToken(user);
        }

        public async Task<Either<RequestError, User>> ChangePasswordAsync(ChangePasswordRequest changePasswordRequest)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == changePasswordRequest.Email);
            if (user == null)
            {
                return RequestError.InvalidCredentials;
            }

            var isPasswordValid = Regex.IsMatch(changePasswordRequest.NewPassword, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,15}$");
            if (!isPasswordValid)
            {
                return RequestError.PasswordFormatError;
            }

            user.Password = _passwordHasher.CreateHash(changePasswordRequest.NewPassword);
            
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private LoginUserResponse GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfiguration.Key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var hours = int.Parse(_jwtConfiguration.TokenExpirationInHours);

            var token = new JwtSecurityToken(
                _jwtConfiguration.Issuer,
                _jwtConfiguration.Audience,
                new List<Claim>()
                {
                    new Claim("Id", user.Id.ToString())
                },
                expires: DateTime.Now.AddHours(hours),
                signingCredentials: credentials);

            return new LoginUserResponse
            {
                Email = user.Email,
                Username = user.Name,
                Token = new JwtSecurityTokenHandler().WriteToken(token)
            };
        }
    }
}
