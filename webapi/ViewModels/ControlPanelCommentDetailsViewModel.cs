namespace webapi.ViewModels
{
    public class ControlPanelCommentDetailsViewModel
    {
        public required string Id { get; set; }
        public required string Content { get; set; }
        public required string PostTitle { get; set; }
        public required string PostId { get; set; }
        public required string Author { get; set; }
        public int ReplyCount { get; set; }
        public int VoteCount { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
