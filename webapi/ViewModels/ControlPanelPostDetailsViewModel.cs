namespace webapi.ViewModels
{
    public class ControlPanelPostDetailsViewModel
    {
        public required string Id { get; set; }
        public required string Title { get; set; }
        public required string PostType { get; set; }
        public required string Author { get; set; }
        public int CommentCount { get; set; }
        public int VoteCount { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
