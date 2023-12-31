﻿using webapi.Models;

namespace webapi.ViewModels
{
    public class CommentViewModel
    {
        public string Id { get; set; }
        public required string Author { get; set; }
        public required string Content { get; set; }
        public string? ReplyTo { get; set; }
        public int VoteCount { get; set; }
        public bool IsVotedByUser { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
