using System.ComponentModel.DataAnnotations;
using webapi.Models;

namespace webapi.ViewModels
{
    public class NewCommentViewModel
    {
        [StringLength(5000)]
        [Required]
        public required string Content { get; set; }
        [StringLength(22, MinimumLength = 22)]
        public required string PostId { get; set; }
        [StringLength(22, MinimumLength = 22)]
        public string? ReplyTo { get; set; }
    }
}
