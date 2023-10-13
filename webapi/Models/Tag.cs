﻿using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class Tag
    {
        public int TagId { get; set; }
        public string Name { get; set; }
        public List<TagToPost>? TagToPosts { get; set; }
    }
}
