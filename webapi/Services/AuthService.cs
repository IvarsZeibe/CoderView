using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using webapi.Data;
using webapi.ViewModels;

namespace webapi.Services
{
    public class AuthService
    {
        private readonly CoderViewDbContext _context;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IPasswordHasher<IdentityUser> _passwordHasher;

        public AuthService(
            CoderViewDbContext context, SignInManager<IdentityUser> signInManager, 
            UserManager<IdentityUser> userManager, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _signInManager = signInManager;
            _userManager = userManager;
            _httpContextAccessor = httpContextAccessor;
            _passwordHasher = new PasswordHasher<IdentityUser>();
        }

        public async Task<bool> SignInAsync(SignInViewModel model)
        {
            IdentityUser user = _context.Set<IdentityUser>().Where(u => u.UserName == model.Username).FirstOrDefault();
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
            IdentityUser user = new IdentityUser();
            user.UserName = model.Username;
            user.Email = model.Email;
            return _userManager.CreateAsync(user, model.Password);
        }
    }
}