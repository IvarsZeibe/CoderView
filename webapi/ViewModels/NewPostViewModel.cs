﻿using System.ComponentModel.DataAnnotations;
using webapi.Validators;

namespace webapi.ViewModels
{
    public class NewPostViewModel
    {
        [StringLength(150, MinimumLength = 5)]
        [Required]
        public required string Title { get; set; }
        [MinLength(5), MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        [MinLength(5)]
        public required string Content { get; set; }
        public required string PostType { get; set; }
        [MaxLength(20), RegularExpressionList("^[a-zA-Z0-9_ ]{1,30}$")]
        public List<string>? Tags { get; set; }
        public string? ProgrammingLanguage { get; set; }
    }
}
