using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using webapi.Data;
using webapi.Helper;
using webapi.Models;
using webapi.Services;
using webapi.ViewModels;

namespace webapi.Controllers;

[ApiController]
[Authorize(Roles = "Administrator")]
public class ControlPanelController : Controller
{
    private CoderViewDbContext _context;
    private AuthService _authService;
    private PostService _postService;
    private CommentService _commentService;
    private UserService _userService;
    public ControlPanelController(
        CoderViewDbContext context, AuthService authService,
        PostService postService, CommentService commentService,
        UserService userService)
    {
        _context = context;
        _authService = authService;
        _postService = postService;
        _commentService = commentService;
        _userService = userService;
    }

    [HttpGet]
    [Route("/api/controlPanel/posts")]
    public IEnumerable<ControlPanelPostDetailsViewModel> GetPosts()
    {
        return _context.Posts.Select(p =>
            new ControlPanelPostDetailsViewModel
            {
                Author = p.Author.UserName,
                CommentCount = p.Comments.Count,
                CreatedOn = DateTime.SpecifyKind(p.CreatedOn, DateTimeKind.Utc),
                Id = new ShortGuid(p.Id),
                PostType = p.Type.Name,
                Title = p.Title,
                VoteCount = p.Votes.Count
            }
        ).ToList();
    }

    [HttpGet]
    [Route("/api/controlPanel/comments")]
    public IEnumerable<ControlPanelCommentDetailsViewModel> GetComments()
    {
        return _context.Comments.Select(c =>
            new ControlPanelCommentDetailsViewModel
            {
                Author = c.Author.UserName,
                Content = c.Content,
                PostTitle = c.Post.Title,
                PostId = new ShortGuid(c.Post.Id),
                CreatedOn = DateTime.SpecifyKind(c.CreatedOn, DateTimeKind.Utc),
                Id = new ShortGuid(c.Id),
                ReplyCount = c.Replies.Count,
                VoteCount = c.Votes.Count,
            }
        ).ToList();
    }

    [HttpGet]
    [Route("/api/controlPanel/users")]
    public IEnumerable<ControlPanelUserDetailsViewModel> GetUsers()
    {
        var adminRole = _context.Roles.FirstOrDefault(r => r.Name == "Administrator");
        if (adminRole is null) 
        {
            return Enumerable.Empty<ControlPanelUserDetailsViewModel>();
        }

        return _context.Users.Select(u =>
            new ControlPanelUserDetailsViewModel
            {
                CommentCount = u.Comments.Count,
                Email = u.Email,
                Id = new ShortGuid(new Guid(u.Id)),
                IsAdmin = _context.UserRoles.Where(ur => ur.UserId == u.Id && ur.RoleId == adminRole.Id).Any(),
                PostCount = u.Posts.Count,
                Username = u.UserName,
                CreatedOn = DateTime.SpecifyKind(u.CreatedOn, DateTimeKind.Utc),
            }
        ).ToList();
    }

    [HttpDelete]
    [Route("/api/controlPanel/post/{id}/delete")]
    public void DeletePost(string id)
    {
        ShortGuid? shortGuid = ShortGuid.ParseOrDefault(id);
        if (shortGuid is null)
        {
            return;
        }

        Post? post = _context.Posts.FirstOrDefault(p => p.Id == shortGuid.ToGuid());
        if (post is null)
        {
            return;
        }

        _postService.Delete(post);
    }

    [HttpDelete]
    [Route("/api/controlPanel/comment/{id}/delete")]
    public void DeleteComment(string id)
    {
        ShortGuid? shortGuid = ShortGuid.ParseOrDefault(id);
        if (shortGuid is null)
        {
            return;
        }

        Comment? comment = _context.Comments.FirstOrDefault(c => c.Id == shortGuid.ToGuid());
        if (comment is null)
        {
            return;
        }

        _commentService.Delete(comment);
    }

    [HttpDelete]
    [Route("/api/controlPanel/user/{id}/delete")]
    public void DeleteUser(string id)
    {
        ShortGuid? shortGuid = ShortGuid.ParseOrDefault(id);
        if (shortGuid is null)
        {
            return;
        }

        ApplicationUser? user = _context.ApplicationUsers.Find(shortGuid.ToGuid().ToString());
        if (user is null)
        {
            return;
        }

        _userService.Delete(user);
    }

    [HttpPost]
    [Route("/api/controlPanel/user/{id}/resetPassword")]
    public IActionResult ResetPassword(string id)
    {
        ShortGuid? shortGuid = ShortGuid.ParseOrDefault(id);
        if (shortGuid is null)
        {
            return BadRequest();
        }
        var user = _context.Users.Find(shortGuid.ToGuid().ToString());
        if (user is null)
        {
            return BadRequest();
        }
        return Ok(Json(_authService.ResetPassword(user)));
    }

    [HttpPost]
    [Route("/api/controlPanel/user/{id}/grantAdmin")]
    public void GrantAdminPrivileges(string id)
    {
        ShortGuid? shortGuid = ShortGuid.ParseOrDefault(id);
        if (shortGuid is null)
        {
            return;
        }
        var user = _context.Users.Find(shortGuid.ToGuid().ToString());
        if (user is null)
        {
            return;
        }
        _authService.GiveAdminRole(user);
    }

    [HttpPost]
    [Route("/api/controlPanel/user/{id}/removeAdmin")]
    public void RemoveAdminPrivileges(string id)
    {
        ShortGuid? shortGuid = ShortGuid.ParseOrDefault(id);
        if (shortGuid is null)
        {
            return;
        }
        var user = _context.Users.Find(shortGuid.ToGuid().ToString());
        if (user is null)
        {
            return;
        }
        _authService.RemoveAdminRole(user);
    }
}
