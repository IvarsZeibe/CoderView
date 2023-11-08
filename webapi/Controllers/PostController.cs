using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
            return _context.Tags.Select(t => t.Name).ToList();
        }

        [HttpGet]
        [Route("/api/post/all")]
        public List<PostOverviewViewModel> GetPosts(
            string postType,
            [FromQuery] List<string> filteredTags,
            DateTime? timeStamp = null,
            string? titleSearchFilter = null,
            SortOrder sortOrder = SortOrder.Descending,
            string? programmingLanguageFilter = null)
        {
            const int MAX_POSTS_RETURNED = 5;
            IQueryable<Post> posts = _context.Posts.Include(p => p.ProgrammingLanguage);
            posts = sortOrder == SortOrder.Descending ?
                posts.OrderByDescending(p => p.CreatedOn) :
                posts.OrderBy(p => p.CreatedOn);

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

            if (filteredTags.Count != 0)
            {
                posts = posts.Where(p => p.TagToPosts
                    .Select(ttp => ttp.Tag.Name)
                    .Where(t => filteredTags.Contains(t))
                    .Count() == filteredTags.Count());
            }

            if (programmingLanguageFilter is not null)
            {
                posts = posts.Where(p => p.ProgrammingLanguage.Name == programmingLanguageFilter);
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
                Tags = _context.TagToPost.Where(ttp => ttp.Post == p).Select(ttp => _context.Tags.First(t => t == ttp.Tag).Name).ToList(),
                ProgrammingLanguage = p.Type.Name == "snippet" ? p.ProgrammingLanguage.Name : null
            }
            ).Take(MAX_POSTS_RETURNED).ToList();
        }

        [HttpGet]
        [Route("/api/post/{id}")]
        public IActionResult GetPost(string id)
        {
            var shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            var post = _context.Posts
                .Include(p => p.Type).Include(p => p.Author)
                .Include(p => p.ProgrammingLanguage)
                .Where(p => shortGuid == p.PostId)
                .FirstOrDefault();
            if (post is null)
            {
                return BadRequest();
            }

            return Ok(new PostViewModel 
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
                    .Select(ttp => _context.Tags.First(t => t == ttp.Tag).Name).ToList(),
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
                    }).ToList(),
                ProgrammingLanguage = post.Type.Name == "snippet" ? post.ProgrammingLanguage.Name : null
            });
        }

        [HttpGet]
        [Route("/api/post/{id}/content")]
        public IActionResult GetPostContent(string id)
        {
            var shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            var post = _context.Posts
                .Include(p => p.Type).Include(p => p.Author)
                .Include(p => p.ProgrammingLanguage)
                .Where(p => shortGuid == p.PostId)
                .FirstOrDefault(); 
            if (post is null)
            {
                return BadRequest();
            }

            if (post.Author.UserName != User.Identity.Name)
            {
                return Unauthorized();
            }

            return Ok(new PostContentViewModel
            {
                Content = post.Content,
                Title = post.Title,
                PostType = post.Type.Name,
                Tags = _context.TagToPost
                    .Where(ttp => ttp.Post == post)
                    .Select(ttp => _context.Tags.First(t => t == ttp.Tag).Name).ToList(),
                ProgrammingLanguage = post.Type.Name == "snippet" ? post.ProgrammingLanguage.Name : null
            });
        }

        [HttpPost]
        [Route("/api/post/{id}/edit")]
        public IActionResult EditPost(string id, PostEditViewModel model)
        {
            var shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            var post = _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Type)
                .Where(p => shortGuid == p.PostId)
                .FirstOrDefault();
            if (post is null)
            {
                return BadRequest();
            }

            if (post.Author.UserName != User.Identity.Name)
            {
                return Unauthorized();
            }

            post.Title = model.Title;
            post.Content = model.Content;

            if (model.ProgrammingLanguage is not null)
            {
                if (post.Type.Name != "snippet")
                {
                    return BadRequest();
                }
                post.ProgrammingLanguage = _context.ProgrammingLanguages.FirstOrDefault(p => p.Name == model.ProgrammingLanguage);
            }

            var postTagsToRemove = _context.TagToPost
                .Include(ttp => ttp.Tag).ThenInclude(t => t.TagToPosts)
                .Where(ttp => ttp.Post == post)
                .ToList();
            foreach (string tagName in model.Tags ?? Enumerable.Empty<string>())
            {
                var postTagToKeep = postTagsToRemove.FirstOrDefault(ttp => _context.Tags.First(t => t == ttp.Tag).Name == tagName);
                if (postTagToKeep is not null)
                {
                    postTagsToRemove.Remove(postTagToKeep);
                    continue;
                }

                var tag = _context.Tags.Where(t => t.Name == tagName).FirstOrDefault();
                if (tag is null)
                {
                    if (tagName != tagName.Trim())
                    {
                        return BadRequest();
                    }
                    tag = _context.Tags.Add(new Models.Tag { Name = tagName }).Entity;
                }

                _context.TagToPost.Add(new TagToPost { Post = post, Tag = tag });
            }
            
            foreach (TagToPost tag in postTagsToRemove)
            {
                _context.TagToPost.Remove(tag);
                if (tag.Tag.TagToPosts.Count == 1)
                {
                    _context.Tags.Remove(tag.Tag);
                }
            }

            _context.SaveChanges();

            return Ok();
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

            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            PostType? postType = _context.PostTypes.Where(p => p.Name == model.PostType).FirstOrDefault();
            if (postType is null)
            {
                return BadRequest();
            }

            ProgrammingLanguage? programmingLanguage = null;
            if (model.ProgrammingLanguage is not null)
            {
                if (postType.Name != "snippet")
                {
                    return BadRequest();
                }
                programmingLanguage = _context.ProgrammingLanguages.FirstOrDefault(p => p.Name == model.ProgrammingLanguage);
            } 

            var post = _context.Posts.Add(new Models.Post
            {
                Author = user,
                Content = model.Content,
                Title = model.Title,
                Type = postType,
                ProgrammingLanguage = programmingLanguage
            }).Entity;

            foreach (string tagName in model.Tags ?? Enumerable.Empty<string>())
            {
                var tag = _context.Tags.Where(t => t.Name == tagName).FirstOrDefault();
                if (tag is null)
                {
                    if (tagName != tagName.Trim())
                    {
                        return BadRequest();
                    }
                    tag = _context.Tags.Add(new Tag { Name = tagName }).Entity;
                }
                _context.TagToPost.Add(new TagToPost { Post = post, Tag = tag });
            }

            _context.SaveChanges();
            return Ok(Json(new ShortGuid(post.PostId).ToString()));
        }


        [HttpDelete]
        [Route("/api/post/{id}/delete")]
        [Authorize]
        public IActionResult DeletePost(string id)
        {
            ShortGuid shortGuid = ShortGuid.ParseOrDefault(id);
            if (shortGuid is null)
            {
                return BadRequest();
            }

            var post = _context.Posts
                .Include(p => p.Author)
                .Include(p => p.Comments).ThenInclude(c => c.Votes)
                .Include(p => p.Votes)
                .Include(p => p.TagToPosts).ThenInclude(ttp => ttp.Tag)
                .FirstOrDefault(p => p.PostId == shortGuid);
            if (post is null)
            {
                return NotFound();
            }

            if (post.Author.UserName != User.Identity.Name)
            {
                return Unauthorized();
            }

            post.Comments?.ForEach(c =>
            {
                _context.Comments.Remove(c);
                c.Votes?.ForEach(v => _context.Votes.Remove(v));
            });

            post.Votes?.ForEach(v => _context.Votes.Remove(v));

            post.TagToPosts?.ForEach(ttp =>
            {
                _context.TagToPost.Remove(ttp);
                if (ttp.Tag.TagToPosts?.Count == 1)
                {
                    _context.Tags.Remove(ttp.Tag);
                }
            });

            _context.Posts.Remove(post);

            _context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        [Route("/api/post/{id}/vote")]
        [Authorize]
        public IActionResult VoteOnPost(string id)
        {
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

            var post = _context.Posts.Find(shortGuid.ToGuid());
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
        [Route("/api/post/{id}/unvote")]
        [Authorize]
        public IActionResult UnvoteOnPost(string id)
        {
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

            var post = _context.Posts.Find(shortGuid.ToGuid());
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
