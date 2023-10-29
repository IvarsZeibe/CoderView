namespace webapi.ViewModels
{
    public class PostOverviewViewModel
    {
        public required string Id { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public required string Author { get; set; }
        public int CommentCount { get; set; }
        public int VoteCount { get; set; }
        public bool IsVotedByUser { get; set; }
        public DateTime CreatedOn { get; set; }
        public List<string>? Tags { get; set; }
        public string? ProgrammingLanguage { get; set; }
    }
}
