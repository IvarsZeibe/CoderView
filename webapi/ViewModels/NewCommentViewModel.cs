using webapi.Models;

namespace webapi.ViewModels
{
    public class NewCommentViewModel
    {
        public required string Content { get; set; }
        public string PostId { get; set; }
        public int? ReplyTo { get; set; }
    }
}
