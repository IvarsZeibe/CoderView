using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using webapi.Data;
using webapi.Helper;
using webapi.Models;

namespace webapi.Services
{
    public class CommentService
    {
        private readonly CoderViewDbContext _context;

        public CommentService(CoderViewDbContext context)
        {
            _context = context;
        }

        public void Delete(Comment comment) 
        {
            var entityEntry = _context.ChangeTracker
                .Entries<Comment>()
                .FirstOrDefault(ee => ee.Entity == comment);
            entityEntry.Collection(e => e.Replies).Load();
            entityEntry.Reference(e => e.ReplyTo).Load();
            entityEntry.Reference(e => e.Author).Load();

            if (comment.Replies.IsNullOrEmpty())
            {
                while (true)
                {
                    var parent = _context.Comments
                        .Include(c => c.ReplyTo)
                        .Include(c => c.Replies)
                        .FirstOrDefault(c => c == comment.ReplyTo);

                    _context.CommentVotes.Where(v => v.Comment == comment).ExecuteDelete();
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
                _context.CommentVotes.Where(v => v.Comment == comment).ExecuteDelete();
                _context.Comments.Remove(comment);
            }
            else
            {
                comment.Author = null;
                comment.Content = null;
            }
            _context.SaveChanges();
        }
    }
}