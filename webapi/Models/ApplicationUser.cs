using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<Post> Posts { get; } = new();
        public List<Comment> Comments { get; } = new();
        public List<PostVote> PostVotes { get; } = new();
        public List<CommentVote> CommentVotes { get; } = new();
    }
}
