using System.ComponentModel.DataAnnotations;

namespace webapi.ViewModels
{
    public class EditCommentViewModel
    {
        [StringLength(5000)]
        [Required]
        public required string NewContent { get; set; }
    }
}