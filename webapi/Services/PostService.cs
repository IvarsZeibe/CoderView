using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Helper;
using webapi.Models;

namespace webapi.Services
{
    public class PostService
    {
        private readonly CoderViewDbContext _context;

        public PostService(CoderViewDbContext context)
        {
            _context = context;
        }

        public void Delete(Post post)
        {
            var entityEntry = _context.ChangeTracker
                .Entries<Post>()
                .FirstOrDefault(ee => ee.Entity == post);
            entityEntry.Collection(e => e.Comments).Load();
            entityEntry.Collection(e => e.Votes).Load();
            entityEntry.Collection(e => e.TagToPosts).Load();
            entityEntry.Collection(e => e.TagToPosts).Load();

            post.Comments?.ForEach(c =>
            {
                _context.Comments.Remove(c);
                _context.CommentVotes.Where(cv => cv.Comment == c).ExecuteDelete();
            });

            post.Votes?.ForEach(v => _context.PostVotes.Remove(v));

            post.TagToPosts?.ForEach(ttp =>
            {
                _context.ChangeTracker
                    .Entries<TagToPost>()
                    .FirstOrDefault(ee => ee.Entity == ttp)
                    .Reference(e => e.Tag)
                    .Load();
                _context.TagToPost.Remove(ttp);
                if (ttp.Tag.TagToPosts?.Count == 1)
                {
                    _context.Tags.Remove(ttp.Tag);
                }
            });

            _context.Posts.Remove(post);

            _context.SaveChanges();
        }
    }
}