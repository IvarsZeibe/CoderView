using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class Post
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public required PostType Type { get; set; }
        public required ApplicationUser Author { get; set; }
        public DateTime CreatedOn { get; set; }
        public ProgrammingLanguage? ProgrammingLanguage { get; set; }
        public string? Description { get; set; }
        public List<Comment> Comments { get; } = new();
        public List<PostVote> Votes { get; } = new();
        public List<TagToPost> TagToPosts { get; } = new();
    }
}
