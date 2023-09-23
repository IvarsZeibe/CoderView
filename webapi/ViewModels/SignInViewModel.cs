using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModels
{
    public class SignInViewModel
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
    }
}
