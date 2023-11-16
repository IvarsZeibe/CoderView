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
    public DbSet<PostVote> PostVotes { get; set; }
    public DbSet<CommentVote> CommentVotes { get; set; }
    public DbSet<ApplicationUser> ApplicationUsers { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<TagToPost> TagToPost { get; set; }
    public DbSet<ProgrammingLanguage> ProgrammingLanguages { get; set; }

    public CoderViewDbContext(DbContextOptions options): base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<PostType>().HasData(
            new PostType { Name = "discussion" },
            new PostType { Name = "snippet" },
            new PostType { Name = "guide" });

        modelBuilder.Entity<Post>()
            .Property(p => p.CreatedOn)
            .HasDefaultValueSql("GETUTCDATE()");

        modelBuilder.Entity<Comment>()
            .Property(c => c.CreatedOn)
            .HasDefaultValueSql("GETUTCDATE()");

        modelBuilder.Entity<Post>()
            .HasMany(c => c.Votes)
            .WithOne(v => v.Post)
            .OnDelete(DeleteBehavior.ClientCascade);

        modelBuilder.Entity<Comment>()
            .HasMany(c => c.Votes)
            .WithOne(v => v.Comment)
            .OnDelete(DeleteBehavior.ClientCascade);

        modelBuilder.Entity<ApplicationUser>()
            .Property(x => x.UserName)
            .HasMaxLength(15);

        modelBuilder.Entity<ApplicationUser>()
            .Property(x => x.Email)
            .HasMaxLength(254);

        modelBuilder.Entity<Tag>()
            .Property(x => x.Name)
            .HasMaxLength(30);

        modelBuilder.Entity<ProgrammingLanguage>()
            .HasData(
                new ProgrammingLanguage { Id = 1, Name = "plaintext" },
                new ProgrammingLanguage { Id = 2, Name = "abap" },
                new ProgrammingLanguage { Id = 3, Name = "apex" },
                new ProgrammingLanguage { Id = 4, Name = "azcli" },
                new ProgrammingLanguage { Id = 5, Name = "bat" },
                new ProgrammingLanguage { Id = 6, Name = "bicep" },
                new ProgrammingLanguage { Id = 7, Name = "cameligo" },
                new ProgrammingLanguage { Id = 8, Name = "clojure" },
                new ProgrammingLanguage { Id = 9, Name = "coffeescript" },
                new ProgrammingLanguage { Id = 10, Name = "c" },
                new ProgrammingLanguage { Id = 11, Name = "cpp" },
                new ProgrammingLanguage { Id = 12, Name = "csharp" },
                new ProgrammingLanguage { Id = 13, Name = "csp" },
                new ProgrammingLanguage { Id = 14, Name = "css" },
                new ProgrammingLanguage { Id = 15, Name = "cypher" },
                new ProgrammingLanguage { Id = 16, Name = "dart" },
                new ProgrammingLanguage { Id = 17, Name = "dockerfile" },
                new ProgrammingLanguage { Id = 18, Name = "ecl" },
                new ProgrammingLanguage { Id = 19, Name = "elixir" },
                new ProgrammingLanguage { Id = 20, Name = "flow9" },
                new ProgrammingLanguage { Id = 21, Name = "fsharp" },
                new ProgrammingLanguage { Id = 22, Name = "freemarker2" },
                new ProgrammingLanguage { Id = 23, Name = "freemarker2.tag-angle.interpolation-dollar" },
                new ProgrammingLanguage { Id = 24, Name = "freemarker2.tag-bracket.interpolation-dollar" },
                new ProgrammingLanguage { Id = 25, Name = "freemarker2.tag-angle.interpolation-bracket" },
                new ProgrammingLanguage { Id = 26, Name = "freemarker2.tag-bracket.interpolation-bracket" },
                new ProgrammingLanguage { Id = 27, Name = "freemarker2.tag-auto.interpolation-dollar" },
                new ProgrammingLanguage { Id = 28, Name = "freemarker2.tag-auto.interpolation-bracket" },
                new ProgrammingLanguage { Id = 29, Name = "go" },
                new ProgrammingLanguage { Id = 30, Name = "graphql" },
                new ProgrammingLanguage { Id = 31, Name = "handlebars" },
                new ProgrammingLanguage { Id = 32, Name = "hcl" },
                new ProgrammingLanguage { Id = 33, Name = "html" },
                new ProgrammingLanguage { Id = 34, Name = "ini" },
                new ProgrammingLanguage { Id = 35, Name = "java" },
                new ProgrammingLanguage { Id = 36, Name = "javascript" },
                new ProgrammingLanguage { Id = 37, Name = "julia" },
                new ProgrammingLanguage { Id = 38, Name = "kotlin" },
                new ProgrammingLanguage { Id = 39, Name = "less" },
                new ProgrammingLanguage { Id = 40, Name = "lexon" },
                new ProgrammingLanguage { Id = 41, Name = "lua" },
                new ProgrammingLanguage { Id = 42, Name = "liquid" },
                new ProgrammingLanguage { Id = 43, Name = "m3" },
                new ProgrammingLanguage { Id = 44, Name = "markdown" },
                new ProgrammingLanguage { Id = 45, Name = "mdx" },
                new ProgrammingLanguage { Id = 46, Name = "mips" },
                new ProgrammingLanguage { Id = 47, Name = "msdax" },
                new ProgrammingLanguage { Id = 48, Name = "mysql" },
                new ProgrammingLanguage { Id = 49, Name = "objective-c" },
                new ProgrammingLanguage { Id = 50, Name = "pascal" },
                new ProgrammingLanguage { Id = 51, Name = "pascaligo" },
                new ProgrammingLanguage { Id = 52, Name = "perl" },
                new ProgrammingLanguage { Id = 53, Name = "pgsql" },
                new ProgrammingLanguage { Id = 54, Name = "php" },
                new ProgrammingLanguage { Id = 55, Name = "pla" },
                new ProgrammingLanguage { Id = 56, Name = "postiats" },
                new ProgrammingLanguage { Id = 57, Name = "powerquery" },
                new ProgrammingLanguage { Id = 58, Name = "powershell" },
                new ProgrammingLanguage { Id = 59, Name = "proto" },
                new ProgrammingLanguage { Id = 60, Name = "pug" },
                new ProgrammingLanguage { Id = 61, Name = "python" },
                new ProgrammingLanguage { Id = 62, Name = "qsharp" },
                new ProgrammingLanguage { Id = 63, Name = "r" },
                new ProgrammingLanguage { Id = 64, Name = "razor" },
                new ProgrammingLanguage { Id = 65, Name = "redis" },
                new ProgrammingLanguage { Id = 66, Name = "redshift" },
                new ProgrammingLanguage { Id = 67, Name = "restructuredtext" },
                new ProgrammingLanguage { Id = 68, Name = "ruby" },
                new ProgrammingLanguage { Id = 69, Name = "rust" },
                new ProgrammingLanguage { Id = 70, Name = "sb" },
                new ProgrammingLanguage { Id = 71, Name = "scala" },
                new ProgrammingLanguage { Id = 72, Name = "scheme" },
                new ProgrammingLanguage { Id = 73, Name = "scss" },
                new ProgrammingLanguage { Id = 74, Name = "shell" },
                new ProgrammingLanguage { Id = 75, Name = "sol" },
                new ProgrammingLanguage { Id = 76, Name = "aes" },
                new ProgrammingLanguage { Id = 77, Name = "sparql" },
                new ProgrammingLanguage { Id = 78, Name = "sql" },
                new ProgrammingLanguage { Id = 79, Name = "st" },
                new ProgrammingLanguage { Id = 80, Name = "swift" },
                new ProgrammingLanguage { Id = 81, Name = "systemverilog" },
                new ProgrammingLanguage { Id = 82, Name = "verilog" },
                new ProgrammingLanguage { Id = 83, Name = "tcl" },
                new ProgrammingLanguage { Id = 84, Name = "twig" },
                new ProgrammingLanguage { Id = 85, Name = "typescript" },
                new ProgrammingLanguage { Id = 86, Name = "vb" },
                new ProgrammingLanguage { Id = 87, Name = "wgsl" },
                new ProgrammingLanguage { Id = 88, Name = "xml" },
                new ProgrammingLanguage { Id = 89, Name = "yaml" },
                new ProgrammingLanguage { Id = 90, Name = "json" }
            );
    }
}