using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Helper;
using webapi.Models;

namespace webapi.Services
{
    public enum SortOrder
    {
        Ascending,
        Descending
    }

    public class UserService
    {
        private readonly CoderViewDbContext _context;
        private readonly CommentService _commentService;
        private readonly PostService _postService;

        public UserService(CoderViewDbContext context, CommentService commentService, PostService postService)
        {
            _context = context;
            _commentService = commentService;
            _postService = postService;
        }

        public void Delete(ApplicationUser user)
        {
            var commentsOnOtherPosts = _context.Comments
                .Where(c => c.Author == user && c.Post.Author != user)
                .ToList();
            commentsOnOtherPosts.ForEach(_commentService.Delete);

            _context.Posts.Where(p => p.Author == user).ToList().ForEach(_postService.Delete);
            
            _context.ApplicationUsers.Remove(user);
            _context.SaveChanges();
        }
    }
}