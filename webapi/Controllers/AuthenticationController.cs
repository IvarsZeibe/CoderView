using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using webapi.Data;
using webapi.Services;
using webapi.ViewModels;

namespace webapi.Controllers;

[ApiController]
public class AuthenticationController : ControllerBase
{
    private AuthService _authService;
    public AuthenticationController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    [Route("/api/isAuthenticated")]
    public bool IsAuthenticated()
    {
        return User.Identity?.IsAuthenticated ?? false;
    }

    [HttpPost]
    [Route("/api/signin")]
    public Task<bool> SignIn(SignInViewModel model)
    {
        return _authService.SignInAsync(model);
    }

    [HttpPost]
    [Route("/api/signup")]
    public Task<IdentityResult> SignUp(SignUpViewModel model)
    {
        return _authService.SignUpAsync(model);
    }

    [HttpPost]
    [Route("/api/signout")]
    public Task SignOutRoute()
    {
        return _authService.SignOutAsync();
    }


    [HttpGet]
    [Route("/api/roles")]
    [Authorize]
    public Task<IList<string>> GetRoles()
    {
        string? username = User?.Identity?.Name;
        if (username.IsNullOrEmpty())
        {
            return Task.FromResult<IList<string>>(Array.Empty<string>());
        }
        return _authService.GetRoles(username);
    }
}
