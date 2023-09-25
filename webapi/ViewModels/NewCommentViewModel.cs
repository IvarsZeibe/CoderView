using webapi.Models;

namespace webapi.ViewModels
{
    public class NewCommentViewModel
    {
        public required string Content { get; set; }
        public int PostId { get; set; }
        public int? ReplyTo { get; set; }
    }
}
