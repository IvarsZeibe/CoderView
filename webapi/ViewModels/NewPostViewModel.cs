using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModels
{
    public class NewPostViewModel
    {
        [StringLength(150, MinimumLength = 5)]
        [Required]
        public required string Title { get; set; }

        [StringLength(40000, MinimumLength = 5)]
        [Required]
        public required string Content { get; set; }
        public required string PostType { get; set; }
        public required string[] Tags { get; set; }
    }
}
