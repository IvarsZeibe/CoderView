using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using System.Reflection.Metadata.Ecma335;
using webapi.Data;
using webapi.Models;
using webapi.ViewModels;

namespace webapi.Controllers
{
    [ApiController]
    public class PostController : Controller
    {
        private CoderViewDbContext _context;
        public PostController(CoderViewDbContext context) 
        {
            _context = context;
        }

        [HttpGet]
        [Route("/api/posts")]
        public List<PostOverviewViewModel> GetPosts()
        {
            var posts = _context.Posts.Select(p => new PostOverviewViewModel
                {
                    Id = p.PostId,
                    Author = p.Author.UserName,
                    Content = p.Content,
                    Title = p.Title,
                    CommentCount = _context.Comments.Where(c => c.Post == p).Count(),
                    VoteCount = _context.Votes.Where(c => c.PostVotedFor == p).Count(),
                    IsVotedByUser = _context.Votes.Any(v => v.PostVotedFor == p && v.User.UserName == User.Identity.Name),
            }
            ).ToList();
            return posts;
        }

        [HttpGet]
        [Route("/api/post/{id}")]
        public PostViewModel GetPost(int id)
        {
            var post = _context.Posts.Include(p => p.Author).Where(p => p.PostId == id).First();
            return new PostViewModel 
            {
                Author = post.Author.UserName,
                Content = post.Content,
                Title = post.Title,
                VoteCount = _context.Votes.Where(v => v.PostVotedFor == post).Count(),
                IsVotedByUser = _context.Votes.Any(v => v.PostVotedFor == post && v.User.UserName == User.Identity.Name),
                Comments = _context.Comments
                    .Where(c => c.Post == post)
                    .Select(c => new CommentViewModel
                {
                    Id = c.CommentId,
                    Author = c.Author.UserName,
                    Content = c.Content,
                    ReplyTo = c.ReplyTo.CommentId,
                    VoteCount = _context.Votes.Where(v => v.CommentVotedFor == c).Count(),
                    IsVotedByUser = _context.Votes.Any(v => v.CommentVotedFor == c && v.User.UserName == User.Identity.Name)
                    }).ToList()
            };
        }

        [HttpPost]
        [Route("/api/new_post")]
        [Authorize]
        public IActionResult PostNewPost(NewPostViewModel model)
        {
            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).First();
            if (user is null)
            {
                return BadRequest();
            }
            var post = _context.Posts.Add(new Models.Post
            {
                Author = user,
                Content = model.Content,
                Title = model.Title,
            });
            _context.SaveChanges();
            return Ok(post.Entity.PostId);
        }
        [HttpPost]
        [Route("/api/comment")]
        [Authorize]
        public IActionResult PostComment(NewCommentViewModel model)
        {
            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var post = _context.Posts.Find(model.PostId);
            if (post is null)
            {
                return BadRequest();
            }

            var replyTo = _context.Comments.Find(model.ReplyTo);
            var comment = _context.Comments.Add(new Models.Comment
            {
                Author = user,
                Content = model.Content,
                Post = post,
                ReplyTo = replyTo
            });
            _context.SaveChanges();

            return Ok(comment.Entity.CommentId);
        }

        [HttpPost]
        [Route("/api/post/vote/{id}")]
        [Authorize]
        public IActionResult VoteOnPost(int id)
        {
            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var post = _context.Posts.Find(id);
            if (post is null)
            {
                return BadRequest();
            }

            if (_context.Votes.Any(v => v.PostVotedFor == post && v.User == user))
            {
                return BadRequest();
            }

            _context.Votes.Add(new Vote
            {
                PostVotedFor = post,
                User = user,
            });
            _context.SaveChanges();

            return Ok();
        }

        [HttpPost]
        [Route("/api/comment/vote/{id}")]
        [Authorize]
        public IActionResult VoteOnComment(int id)
        {
            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var comment = _context.Comments.Find(id);
            if (comment is null)
            {
                return BadRequest();
            }

            if (_context.Votes.Any(v => v.CommentVotedFor == comment && v.User == user))
            {
                return BadRequest();
            }

            _context.Votes.Add(new Vote
            {
                CommentVotedFor = comment,
                User = user,
            });
            _context.SaveChanges();

            return Ok();
        }
    }
}
