using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class Comment
    {
        public int Id { get; set; }
        public required Post Post { get; set; }
        public Comment? ReplyTo { get; set; }
        public string? Content { get; set; }
        public ApplicationUser? Author { get; set; }
        public List<Comment>? Replies { get; set; }
        public DateTime CreatedOn { get; set; }
        public List<Vote>? Votes { get; set; }
    }
}
