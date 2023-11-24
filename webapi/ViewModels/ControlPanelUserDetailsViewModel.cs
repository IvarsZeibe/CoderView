namespace webapi.ViewModels
{
    public class ControlPanelUserDetailsViewModel
    {
        public required string Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public bool IsAdmin { get; set; }
        public int CommentCount { get; set; }
        public int PostCount { get; set; }
    }
}
