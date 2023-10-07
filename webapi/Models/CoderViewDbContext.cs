using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Metadata;
using webapi.Models;

namespace webapi.Data;

public class CoderViewDbContext : IdentityDbContext<ApplicationUser>
{
    public DbSet<Post> Posts { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Vote> Votes { get; set; }
    public DbSet<ApplicationUser> ApplicationUsers { get; set; }

    public CoderViewDbContext(DbContextOptions options)
        : base(options)
    {
        Database.EnsureCreated();
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

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
    }
}