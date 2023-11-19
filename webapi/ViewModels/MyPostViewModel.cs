using System.ComponentModel.DataAnnotations;
using webapi.Models;

namespace webapi.ViewModels
{
    public class MyPostViewModel
    {
        public required string Id { get; set; }
        public required string Title { get; set; }
        public DateTime CreatedOn { get; set; }
        public int VoteCount { get; set; }
        public int CommentCount { get; set; }
    }
}
