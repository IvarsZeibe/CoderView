using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

    [HttpPost]
    [Authorize]
    [Route("/api/profile")]
    public IActionResult GetUserData()
    {
        var user = _authService.GetUserByUsernameAsync(User.Identity.Name).Result;
        if (user is null)
        {
            return BadRequest();
        }
        return Ok(new ProfileViewModel { Username = user.UserName, Email = user.Email });
    }

    [HttpPost]
    [Authorize]
    [Route("/api/profile/changeUsername")]
    public Task<IdentityResult> PostChangeUsername([FromBody]string username)
    {
        return _authService.ChangeUsername(User.Identity.Name, username);
    }

    [HttpPost]
    [Authorize]
    [Route("/api/profile/changeEmail")]
    public Task<IdentityResult> PostChangeEmail([FromBody]string email)
    {
        return _authService.ChangeEmail(User.Identity.Name, email);
    }

    [HttpPost]
    [Authorize]
    [Route("/api/profile/changePassword")]
    public Task<IdentityResult> PostChangeUsername(PasswordChangeViewModel passwordChange)
    {
        return _authService.ChangePassword(User.Identity.Name, passwordChange.CurrentPassword, passwordChange.NewPassword);
    }
}
