using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using webapi.Data;
using webapi.Helper;
using webapi.Models;
using webapi.Services;
using webapi.ViewModels;

namespace webapi.Controllers;

[ApiController]
[Authorize]
public class ProfileController : ControllerBase
{
    private CoderViewDbContext _context;
    private AuthService _authService;
    public ProfileController(CoderViewDbContext context, AuthService authService)
    {
        _context = context;
        _authService = authService;
    }

    [HttpPost]
    [Route("/api/profile")]
    public IActionResult GetUserData()
    {
        ApplicationUser? user = _context.ApplicationUsers.FirstOrDefault(u => u.UserName == User.Identity.Name);
        if (user is null)
        {
            return BadRequest();
        }
        return Ok(new ProfileViewModel { Username = user.UserName, Email = user.Email });
    }

    [HttpPost]
    [Route("/api/profile/changeUsername")]
    public Task<IdentityResult> PostChangeUsername([FromBody] string username)
    {
        return _authService.ChangeUsername(User.Identity.Name, username);
    }

    [HttpPost]
    [Route("/api/profile/changeEmail")]
    public Task<IdentityResult> PostChangeEmail([FromBody] string email)
    {
        return _authService.ChangeEmail(User.Identity.Name, email);
    }

    [HttpPost]
    [Route("/api/profile/changePassword")]
    public Task<IdentityResult> PostChangeUsername(PasswordChangeViewModel passwordChange)
    {
        return _authService.ChangePassword(User.Identity.Name, passwordChange.CurrentPassword, passwordChange.NewPassword);
    }

    [HttpGet]
    [Route("/api/profile/comments")]
    public IActionResult GetCommentHistory()
    {
        ApplicationUser? user = _context.ApplicationUsers.FirstOrDefault(u => u.UserName == User.Identity.Name);
        if (user is null)
        {
            return BadRequest();
        }

        return Ok(_context.Comments
            .Where(c => c.Author == user)
            .OrderByDescending(c => c.CreatedOn)
            .Select(c => new MyCommentViewModel
        {
            CommentId = new ShortGuid(c.Id),
            CommentContent = c.Content ?? "",
            PostId = new ShortGuid(c.Post.Id),
            PostTitle = c.Post.Title,
            CreatedOn = DateTime.SpecifyKind(c.CreatedOn, DateTimeKind.Utc),
            VoteCount = _context.CommentVotes.Where(cv => cv.Comment == c).Count()
        }));
    }

    [HttpGet]
    [Route("/api/profile/posts")]
    public IActionResult GetPostHistory()
    {
        ApplicationUser? user = _context.ApplicationUsers.FirstOrDefault(u => u.UserName == User.Identity.Name);
        if (user is null)
        {
            return BadRequest();
        }

        return Ok(_context.Posts
            .Where(p => p.Author == user)
            .OrderByDescending(p => p.CreatedOn)
            .Select(p => new MyPostViewModel
        {
            Id = new ShortGuid(p.Id),
            Title = p.Title,
            CreatedOn = DateTime.SpecifyKind(p.CreatedOn, DateTimeKind.Utc),
            CommentCount = _context.Comments.Where(c => c.Post == p).Count(),
            VoteCount = _context.PostVotes.Where(pv => pv.Post == p).Count()
        }));
    }

    [HttpPost]
    [Route("/api/profile/delete")]
    public IActionResult DeleteAccount()
    {
        ApplicationUser? user = _context.ApplicationUsers.FirstOrDefault(u => u.UserName == User.Identity.Name);
        if (user is null)
        {
            return BadRequest();
        }

        _context.RemoveRange(_context.Comments.Where(c => c.Author == user));

        _context.ApplicationUsers.Remove(user);
        _context.SaveChanges();
        return Ok();
    }
}
