﻿namespace webapi.ViewModels
{
    public class PostViewModel
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public required string Author { get; set; }
        public List<CommentViewModel>? Comments { get; set; }
        public List<string>? Tags { get; set; }
        public int VoteCount { get; set; }
        public bool IsVotedByUser { get; set; }
        public DateTime CreatedOn { get; set; }
        public required string PostType { get; set; }
        public string? ProgrammingLanguage { get; set; }
    }
}
