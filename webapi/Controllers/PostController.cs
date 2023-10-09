using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using webapi.Data;
using webapi.Helper;
using webapi.Models;
using webapi.ViewModels;

namespace webapi.Controllers
{
    public enum SortOrder
    {
        Ascending,
        Descending
    }

    [ApiController]
    public class PostController : Controller
    {
        private CoderViewDbContext _context;
        public PostController(CoderViewDbContext context) 
        {
            _context = context;
        }

        [HttpGet]
        [Route("/api/tags")]
        public List<string> GetTags()
        {
            return _context.Tag.Select(t => t.Name).ToList();
        }

        [HttpGet]
        [Route("/api/post/all")]
        public List<PostOverviewViewModel> GetPosts(
            string postType,
            DateTime? timeStamp,
            string? titleSearchFilter,
            SortOrder sortOrder = SortOrder.Descending)
        {
            const int MAX_POSTS_RETURNED = 5;

            IQueryable<Post> posts = sortOrder == SortOrder.Descending ?
                _context.Posts.OrderByDescending(p => p.CreatedOn) :
                _context.Posts.OrderBy(p => p.CreatedOn);

            posts = posts.Where(p => p.Type.Name == postType);

            if (timeStamp is not null)
            {
                posts = sortOrder == SortOrder.Descending ?
                    posts.Where(p => p.CreatedOn < timeStamp) :
                    posts.Where(p => p.CreatedOn > timeStamp);
            }

            if (titleSearchFilter is not null)
            {
                posts = posts.Where(p => p.Title.Contains(titleSearchFilter));
            }

            return posts.Select(p => new PostOverviewViewModel
            {
                Id = new ShortGuid(p.PostId),
                Author = p.Author.UserName,
                Content = p.Content,
                Title = p.Title,
                CommentCount = _context.Comments.Where(c => c.Post == p).Count(),
                VoteCount = _context.Votes.Where(c => c.PostVotedFor == p).Count(),
                IsVotedByUser = _context.Votes.Any(v => v.PostVotedFor == p && v.User.UserName == User.Identity.Name),
                CreatedOn = DateTime.SpecifyKind(p.CreatedOn, DateTimeKind.Utc),
                Tags = _context.TagToPost.Where(ttp => ttp.Post == p).Select(ttp => _context.Tag.First(t => t == ttp.Tag).Name).ToList()
            }
            ).Take(MAX_POSTS_RETURNED).ToList();
        }

        [HttpGet]
        [Route("/api/post/{id}")]
        public PostViewModel GetPost(string id)
        {
            var post = _context.Posts.Include(p => p.Type).Include(p => p.Author).Where(p => ShortGuid.Parse(id) == p.PostId).First();
            return new PostViewModel 
            {
                Author = post.Author.UserName,
                Content = post.Content,
                Title = post.Title,
                VoteCount = _context.Votes.Where(v => v.PostVotedFor == post).Count(),
                IsVotedByUser = _context.Votes.Any(v => v.PostVotedFor == post && v.User.UserName == User.Identity.Name),
                CreatedOn = DateTime.SpecifyKind(post.CreatedOn, DateTimeKind.Utc),
                PostType = post.Type.Name,
                Tags = _context.TagToPost
                    .Where(ttp => ttp.Post == post)
                    .Select(ttp => _context.Tag.First(t => t == ttp.Tag).Name).ToList(),
                Comments = _context.Comments
                    .Where(c => c.Post == post)
                    .Select(c => new CommentViewModel
                {
                    Id = c.CommentId,
                    Author = c.Author.UserName,
                    Content = c.Content,
                    ReplyTo = c.ReplyTo.CommentId,
                    VoteCount = _context.Votes.Where(v => v.CommentVotedFor == c).Count(),
                    IsVotedByUser = _context.Votes.Any(v => v.CommentVotedFor == c && v.User.UserName == User.Identity.Name),
                    CreatedOn = DateTime.SpecifyKind(c.CreatedOn, DateTimeKind.Utc)
                    }).ToList()
            };
        }

        [HttpPost]
        [Route("/api/post/create")]
        [Authorize]
        public IActionResult CreateNewPost(NewPostViewModel model)
        {
            model.Title = model.Title.Trim();
            model.Content = model.Content.Trim();
            if (!TryValidateModel(model))
            {
                return BadRequest(ModelState);
            }

            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).First();
            if (user is null)
            {
                return BadRequest();
            }

            PostType? postType = _context.PostTypes.Where(p => p.Name == model.PostType).FirstOrDefault();
            if (postType is null)
            {
                return BadRequest();
            }

            var post = _context.Posts.Add(new Models.Post
            {
                Author = user,
                Content = model.Content,
                Title = model.Title,
                Type = postType,
            }).Entity;

            foreach (string tagName in model.Tags)
            {
                var tag = _context.Tag.Where(t => t.Name == tagName).FirstOrDefault();
                if (tag is null)
                {
                    if (tagName != tagName.Trim())
                    {
                        return BadRequest();
                    }
                    tag = _context.Tag.Add(new Models.Tag { Name = tagName }).Entity;
                }
                _context.TagToPost.Add(new TagToPost { Post = post, Tag = tag });
            }

            _context.SaveChanges();
            return Ok(Json(new ShortGuid(post.PostId).ToString()));
        }

        [HttpPost]
        [Route("/api/post/vote/{id}")]
        [Authorize]
        public IActionResult VoteOnPost(string id)
        {
            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var post = _context.Posts.Find(ShortGuid.Parse(id).ToGuid());
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
        [Route("/api/post/unvote/{id}")]
        [Authorize]
        public IActionResult UnvoteOnPost(string id)
        {
            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var post = _context.Posts.Find(ShortGuid.Parse(id).ToGuid());
            if (post is null)
            {
                return BadRequest();
            }

            var vote = _context.Votes.Where(v => v.PostVotedFor == post && v.User == user).FirstOrDefault();
            if (vote is null)
            {
                return BadRequest();
            }

            _context.Votes.Remove(vote);
            _context.SaveChanges();

            return Ok();
        }
    }
}
