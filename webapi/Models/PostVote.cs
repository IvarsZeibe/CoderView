using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class PostVote
    {
        public int Id { get; set; }
        public required Post Post { get; set; }
        public required ApplicationUser User { get; set; }
    }
}
