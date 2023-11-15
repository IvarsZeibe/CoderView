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
        public List<Comment>? Comments { get; set; }
        public List<Vote>? Votes { get; set; }
        public List<TagToPost>? TagToPosts { get; set; }
        public ProgrammingLanguage? ProgrammingLanguage { get; set; }
        public string? Description { get; set; }
    }
}
