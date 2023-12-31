﻿using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public List<TagToPost> TagToPosts { get; } = new();
    }
}
