namespace webapi.ViewModels
{
    public class PostContentViewModel
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        public List<string>? Tags { get; set; }
        public required string PostType { get; set; }
    }
}
