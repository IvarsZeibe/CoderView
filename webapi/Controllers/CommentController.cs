﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using webapi.Data;
using webapi.Helper;
using webapi.Models;
using webapi.ViewModels;

namespace webapi.Controllers
{
    [ApiController]
    public class CommentController : Controller
    {
        private CoderViewDbContext _context;
        public CommentController(CoderViewDbContext context) 
        {
            _context = context;
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

            var post = _context.Posts.Find(ShortGuid.Parse(model.PostId).ToGuid());
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

        [HttpPost]
        [Route("/api/comment/unvote/{id}")]
        [Authorize]
        public IActionResult UnvoteOnComment(int id)
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

            var vote = _context.Votes.Where(v => v.CommentVotedFor == comment && v.User == user).FirstOrDefault();
            if (vote is null)
            {
                return BadRequest();
            }

            _context.Votes.Remove(vote);
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete]
        [Route("/api/comment/{id}")]
        [Authorize]
        public IActionResult DeleteComment(int id)
        {
            ApplicationUser? user = _context.ApplicationUsers.Where(u => u.UserName == User.Identity.Name).FirstOrDefault();
            if (user is null)
            {
                return BadRequest();
            }

            var comment = _context.Comments
                .Include(c => c.ReplyTo)
                .Include(c => c.Replies)
                .FirstOrDefault(c => c.CommentId == id);

            if (comment is null)
            {
                return BadRequest();
            }

            if (comment.Author != user)
            {
                return Unauthorized();
            }

            if (comment.Replies.IsNullOrEmpty())
            {
                while (true)
                {
                    var parent = _context.Comments
                        .Include(c => c.ReplyTo)
                        .Include(c => c.Replies)
                        .FirstOrDefault(c => c == comment.ReplyTo);

                    _context.Votes.Where(v => v.CommentVotedFor == comment).ExecuteDelete();
                    _context.Comments.Remove(comment);
                    if (parent is not null && parent.Content is null && parent.Replies.Count == 1)
                    {
                        comment = parent;
                    }
                    else
                    {
                        break;
                    }
                }
                _context.Votes.Where(v => v.CommentVotedFor == comment).ExecuteDelete();
                _context.Comments.Remove(comment);
            }
            else
            {
                comment.Author = null;
                comment.Content = null;
            }

            _context.SaveChanges();
            return Ok();
        }
    }
}