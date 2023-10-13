namespace webapi.ViewModels
{
    public class PostEditViewModel
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public List<string>? Tags { get; set; }
    }
}
