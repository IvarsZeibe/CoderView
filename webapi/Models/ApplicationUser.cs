using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class ApplicationUser : IdentityUser
    {
        public List<Post>? Posts { get; set; }
        public List<Comment>? Comments { get; set; }
        public List<Vote>? Votes { get; set; }
    }
}
