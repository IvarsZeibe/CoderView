using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using webapi.Models;

namespace webapi.Data;

public class CoderViewDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<PostType> PostTypes { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Vote> Votes { get; set; }
    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Tag> Tag { get; set; }
    public DbSet<TagToPost> TagToPost { get; set; }

    public CoderViewDbContext(DbContextOptions options)
        : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PostType>().HasData(
            new PostType { Name = "discussion" },
            new PostType { Name = "snippet" });

        modelBuilder.Entity<Post>()
            .Property(p => p.CreatedOn)
            .HasDefaultValueSql("GETUTCDATE()");

        modelBuilder.Entity<Comment>()
            .Property(c => c.CreatedOn)
            .HasDefaultValueSql("GETUTCDATE()");

        modelBuilder.Entity<ApplicationUser>()
            .Property(x => x.UserName)
            .HasMaxLength(15);

        modelBuilder.Entity<ApplicationUser>()
            .Property(x => x.Email)
            .HasMaxLength(254);

        modelBuilder.Entity<Tag>()
            .Property(x => x.Name)
            .HasMaxLength(30);
    }
}