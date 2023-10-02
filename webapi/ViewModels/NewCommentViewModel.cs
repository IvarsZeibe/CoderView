﻿using System.ComponentModel.DataAnnotations;
using webapi.Models;

namespace webapi.ViewModels
{
    public class NewCommentViewModel
    {
        [StringLength(5000)]
        [Required]
        public required string Content { get; set; }
        public string PostId { get; set; }
        public int? ReplyTo { get; set; }
    }
}
