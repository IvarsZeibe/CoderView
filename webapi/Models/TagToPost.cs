﻿using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace webapi.Models
{
    public class TagToPost
    {
        public int Id { get; set; }
        public required Post Post { get; set; }
        public required Tag Tag { get; set; }
    }
}
