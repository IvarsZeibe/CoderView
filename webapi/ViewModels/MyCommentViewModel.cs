using System.ComponentModel.DataAnnotations;
using webapi.Models;

namespace webapi.ViewModels
{
    public class MyCommentViewModel
    {
        public required string PostTitle { get; set; }
        public required string PostId { get; set; }
        public required string CommentId { get; set; }
        public required string CommentContent { get; set; }
        public DateTime CreatedOn { get; set; }
        public int VoteCount { get; set; }
    }
}
