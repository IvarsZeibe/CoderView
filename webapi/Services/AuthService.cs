using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using webapi.Data;
using webapi.Models;
using webapi.ViewModels;

namespace webapi.Services
{
    public class AuthService
    {
        private readonly CoderViewDbContext _context;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPasswordHasher<ApplicationUser> _passwordHasher;

        public AuthService(
            CoderViewDbContext context, SignInManager<ApplicationUser> signInManager, 
            UserManager<ApplicationUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _passwordHasher = new PasswordHasher<ApplicationUser>();
        }

        public async Task<bool> SignInAsync(SignInViewModel model)
        {
            ApplicationUser user = _context.ApplicationUsers.Where(u => u.UserName == model.Username).FirstOrDefault();
            if (user is null)
            {
                return false;
            }

            bool isPasswordCorrect = 
                _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password) == PasswordVerificationResult.Success;

            if (!isPasswordCorrect)
            {
                return false;
            }

            var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
            identity.AddClaim(new Claim(ClaimTypes.Name, user.UserName));
            await _signInManager.SignInAsync(user, isPersistent: false);
            return true;
        }

        public async Task SignOutAsync()
        {
            if (_httpContextAccessor.HttpContext?.User.Identity.IsAuthenticated == true)
            {
                await _signInManager.SignOutAsync();
            }
        }

        public async Task<bool> CheckIfEmailExistsAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            return user != null;
        }

        public Task<IdentityResult> SignUpAsync(SignUpViewModel model)
        {
            ApplicationUser user = new ApplicationUser();
            user.UserName = model.Username;
            user.Email = model.Email;
            return _userManager.CreateAsync(user, model.Password);
        }

        public async Task<IdentityResult> ChangeUsername(string currentUsername, string newUsername)
        {
            var user = _userManager.FindByNameAsync(currentUsername).Result;
            if (user is null) 
            {
                return IdentityResult.Failed();
            }
            var response = _userManager.SetUserNameAsync(user, newUsername).Result;
            if (response.Succeeded)
            {
                await _signInManager.SignOutAsync();
                await _signInManager.SignInAsync(user, isPersistent: false);
            }
            return response;
        }

        public Task<IdentityResult> ChangeEmail(string username, string newEmail)
        {
            var user = _userManager.FindByNameAsync(username).Result;
            if (user is null)
            {
                return Task.FromResult(IdentityResult.Failed());
            }
            return _userManager.SetEmailAsync(user, newEmail);
        }

        public Task<IdentityResult> ChangePassword(string username, string currentPassword, string newPassword)
        {
            var user = _userManager.FindByNameAsync(username).Result;
            if (user is null)
            {
                return Task.FromResult(IdentityResult.Failed());
            }
            return _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
        }

        public Task<ApplicationUser?> GetUserByUsernameAsync(string username)
        {
            return _userManager.FindByNameAsync(username);
        }

        public Task<IList<string>> GetRoles(string username)
        {
            var user = _userManager.FindByNameAsync(username).Result;
            if (user is null)   
            {
                return Task.FromResult<IList<string>>(Array.Empty<string>());
            }
            return _userManager.GetRolesAsync(user);
        }
    }
}