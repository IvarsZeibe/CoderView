using System.ComponentModel.DataAnnotations;
using webapi.Validators;

namespace webapi.ViewModels
{
    public class PostEditViewModel
    {
        public required string Title { get; set; }
        public required string Content { get; set; }
        [MaxLength(20), RegularExpressionList("^[a-zA-Z0-9_ ]{1,30}$")]
        public List<string>? Tags { get; set; }
        public string? ProgrammingLanguage { get; set; }
    }
}
