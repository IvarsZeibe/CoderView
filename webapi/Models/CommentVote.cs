using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class CommentVote
    {
        public int Id { get; set; }
        public required Comment Comment { get; set; }
        public required ApplicationUser User { get; set; }
    }
}
