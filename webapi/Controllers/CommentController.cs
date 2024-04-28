using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using webapi.Data;
using webapi.Helper;
using webapi.Models;
using webapi.Services;
using webapi.ViewModels;

namespace webapi.Controllers
{
    [ApiController]
    public class CommentController : Controller
    {
        private CoderViewDbContext _context;
        private CommentService _commentService;
        public CommentController(CoderViewDbContext context, CommentService commentService) 
        {
            _context = context;
            _commentService = commentService;
        }

        [HttpPost]
        [Route("/api/comment")]
        [Authorize]
        public IActionResult CreateComment(NewCommentViewModel model)
        {
            model.Content = model.Content.Trim();
            if (!TryValidateModel(model))
            {
                return BadRequest(ModelState);
            }

            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }


            var shortGuid = ShortGuid.ParseOrDefault(model.PostId);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            var post = _context.Posts.Find(shortGuid.ToGuid());
            if (post is null)
            {
                return BadRequest();
            }

            var replyTo = _context.Comments.Find(ShortGuid.ParseOrDefault(model.ReplyTo)?.ToGuid());
            var comment = _context.Comments.Add(new Models.Comment
            {
                Author = user,
                Content = model.Content,
                Post = post,
                ReplyTo = replyTo
            });
            _context.SaveChanges();

            return Ok(Json(new ShortGuid(comment.Entity.Id).ToString()));
        }

        [HttpPost]
        [Route("/api/comment/{id}/edit")]
        [Authorize]
        public IActionResult EditComment(string id, EditCommentViewModel model)
        {
            model.NewContent = model.NewContent.Trim();
            if (!TryValidateModel(model))
            {
                return BadRequest(ModelState);
            }

            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }


            var shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            var comment = _context.Comments.Find(shortGuid.ToGuid());
            if (comment is null)
            {
                return BadRequest();
            }

            comment.Content = model.NewContent;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Route("/api/comment/{id}/vote")]
        [Authorize]
        public IActionResult VoteOnComment(string id)
        {
            var shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var comment = _context.Comments.Find(shortGuid.ToGuid());
            if (comment is null)
            {
                return BadRequest();
            }

            if (_context.CommentVotes.Any(v => v.Comment == comment && v.User == user))
            {
                return BadRequest();
            }

            _context.CommentVotes.Add(new CommentVote
            {
                Comment = comment,
                User = user,
            });
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Route("/api/comment/{id}/unvote")]
        [Authorize]
        public IActionResult UnvoteOnComment(string id)
        {
            var shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var comment = _context.Comments.Find(shortGuid.ToGuid());
            if (comment is null)
            {
                return BadRequest();
            }

            var vote = _context.CommentVotes.Where(v => v.Comment == comment && v.User == user).FirstOrDefault();
            if (vote is null)
            {
                return BadRequest();
            }

            _context.CommentVotes.Remove(vote);
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete]
        [Route("/api/comment/{id}")]
        [Authorize]
        public IActionResult DeleteComment(string id)
        {
            var shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var comment = _context.Comments
                .Include(c => c.ReplyTo)
                .Include(c => c.Replies)
                .FirstOrDefault(c => c.Id == shortGuid);

            if (comment is null)
            {
                return BadRequest();
            }

            if (comment.Author != user)
            {
                return Unauthorized();
            }

            _commentService.Delete(comment);

            return Ok();
        }
    }
}
