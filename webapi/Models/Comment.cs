using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public Post? Post { get; set; }
        public Comment? ReplyTo { get; set; }
        public required string Content { get; set; }
        public required ApplicationUser Author { get; set; }
    }
}
