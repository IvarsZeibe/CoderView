using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class Vote
    {
        public int VoteId { get; set; }
        public Comment? CommentVotedFor { get; set; }
        public Post? PostVotedFor { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
