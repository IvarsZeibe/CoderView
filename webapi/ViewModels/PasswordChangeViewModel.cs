using webapi.Models;

namespace webapi.ViewModels
{
    public class PasswordChangeViewModel
    {
        public required string CurrentPassword { get; set; }
        public required string NewPassword { get; set; }
    }
}
