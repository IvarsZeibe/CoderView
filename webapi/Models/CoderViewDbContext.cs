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
    public DbSet<Tag> Tags { get; set; }
    public DbSet<TagToPost> TagToPost { get; set; }
    public DbSet<ProgrammingLanguage> ProgrammingLanguages { get; set; }

    public CoderViewDbContext(DbContextOptions options): base(options) { }

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

        modelBuilder.Entity<ProgrammingLanguage>()
            .HasData(
                new ProgrammingLanguage { ProgrammingLanguageId = 1, Name = "plaintext" },
                new ProgrammingLanguage { ProgrammingLanguageId = 2, Name = "abap" },
                new ProgrammingLanguage { ProgrammingLanguageId = 3, Name = "apex" },
                new ProgrammingLanguage { ProgrammingLanguageId = 4, Name = "azcli" },
                new ProgrammingLanguage { ProgrammingLanguageId = 5, Name = "bat" },
                new ProgrammingLanguage { ProgrammingLanguageId = 6, Name = "bicep" },
                new ProgrammingLanguage { ProgrammingLanguageId = 7, Name = "cameligo" },
                new ProgrammingLanguage { ProgrammingLanguageId = 8, Name = "clojure" },
                new ProgrammingLanguage { ProgrammingLanguageId = 9, Name = "coffeescript" },
                new ProgrammingLanguage { ProgrammingLanguageId = 10, Name = "c" },
                new ProgrammingLanguage { ProgrammingLanguageId = 11, Name = "cpp" },
                new ProgrammingLanguage { ProgrammingLanguageId = 12, Name = "csharp" },
                new ProgrammingLanguage { ProgrammingLanguageId = 13, Name = "csp" },
                new ProgrammingLanguage { ProgrammingLanguageId = 14, Name = "css" },
                new ProgrammingLanguage { ProgrammingLanguageId = 15, Name = "cypher" },
                new ProgrammingLanguage { ProgrammingLanguageId = 16, Name = "dart" },
                new ProgrammingLanguage { ProgrammingLanguageId = 17, Name = "dockerfile" },
                new ProgrammingLanguage { ProgrammingLanguageId = 18, Name = "ecl" },
                new ProgrammingLanguage { ProgrammingLanguageId = 19, Name = "elixir" },
                new ProgrammingLanguage { ProgrammingLanguageId = 20, Name = "flow9" },
                new ProgrammingLanguage { ProgrammingLanguageId = 21, Name = "fsharp" },
                new ProgrammingLanguage { ProgrammingLanguageId = 22, Name = "freemarker2" },
                new ProgrammingLanguage { ProgrammingLanguageId = 23, Name = "freemarker2.tag-angle.interpolation-dollar" },
                new ProgrammingLanguage { ProgrammingLanguageId = 24, Name = "freemarker2.tag-bracket.interpolation-dollar" },
                new ProgrammingLanguage { ProgrammingLanguageId = 25, Name = "freemarker2.tag-angle.interpolation-bracket" },
                new ProgrammingLanguage { ProgrammingLanguageId = 26, Name = "freemarker2.tag-bracket.interpolation-bracket" },
                new ProgrammingLanguage { ProgrammingLanguageId = 27, Name = "freemarker2.tag-auto.interpolation-dollar" },
                new ProgrammingLanguage { ProgrammingLanguageId = 28, Name = "freemarker2.tag-auto.interpolation-bracket" },
                new ProgrammingLanguage { ProgrammingLanguageId = 29, Name = "go" },
                new ProgrammingLanguage { ProgrammingLanguageId = 30, Name = "graphql" },
                new ProgrammingLanguage { ProgrammingLanguageId = 31, Name = "handlebars" },
                new ProgrammingLanguage { ProgrammingLanguageId = 32, Name = "hcl" },
                new ProgrammingLanguage { ProgrammingLanguageId = 33, Name = "html" },
                new ProgrammingLanguage { ProgrammingLanguageId = 34, Name = "ini" },
                new ProgrammingLanguage { ProgrammingLanguageId = 35, Name = "java" },
                new ProgrammingLanguage { ProgrammingLanguageId = 36, Name = "javascript" },
                new ProgrammingLanguage { ProgrammingLanguageId = 37, Name = "julia" },
                new ProgrammingLanguage { ProgrammingLanguageId = 38, Name = "kotlin" },
                new ProgrammingLanguage { ProgrammingLanguageId = 39, Name = "less" },
                new ProgrammingLanguage { ProgrammingLanguageId = 40, Name = "lexon" },
                new ProgrammingLanguage { ProgrammingLanguageId = 41, Name = "lua" },
                new ProgrammingLanguage { ProgrammingLanguageId = 42, Name = "liquid" },
                new ProgrammingLanguage { ProgrammingLanguageId = 43, Name = "m3" },
                new ProgrammingLanguage { ProgrammingLanguageId = 44, Name = "markdown" },
                new ProgrammingLanguage { ProgrammingLanguageId = 45, Name = "mdx" },
                new ProgrammingLanguage { ProgrammingLanguageId = 46, Name = "mips" },
                new ProgrammingLanguage { ProgrammingLanguageId = 47, Name = "msdax" },
                new ProgrammingLanguage { ProgrammingLanguageId = 48, Name = "mysql" },
                new ProgrammingLanguage { ProgrammingLanguageId = 49, Name = "objective-c" },
                new ProgrammingLanguage { ProgrammingLanguageId = 50, Name = "pascal" },
                new ProgrammingLanguage { ProgrammingLanguageId = 51, Name = "pascaligo" },
                new ProgrammingLanguage { ProgrammingLanguageId = 52, Name = "perl" },
                new ProgrammingLanguage { ProgrammingLanguageId = 53, Name = "pgsql" },
                new ProgrammingLanguage { ProgrammingLanguageId = 54, Name = "php" },
                new ProgrammingLanguage { ProgrammingLanguageId = 55, Name = "pla" },
                new ProgrammingLanguage { ProgrammingLanguageId = 56, Name = "postiats" },
                new ProgrammingLanguage { ProgrammingLanguageId = 57, Name = "powerquery" },
                new ProgrammingLanguage { ProgrammingLanguageId = 58, Name = "powershell" },
                new ProgrammingLanguage { ProgrammingLanguageId = 59, Name = "proto" },
                new ProgrammingLanguage { ProgrammingLanguageId = 60, Name = "pug" },
                new ProgrammingLanguage { ProgrammingLanguageId = 61, Name = "python" },
                new ProgrammingLanguage { ProgrammingLanguageId = 62, Name = "qsharp" },
                new ProgrammingLanguage { ProgrammingLanguageId = 63, Name = "r" },
                new ProgrammingLanguage { ProgrammingLanguageId = 64, Name = "razor" },
                new ProgrammingLanguage { ProgrammingLanguageId = 65, Name = "redis" },
                new ProgrammingLanguage { ProgrammingLanguageId = 66, Name = "redshift" },
                new ProgrammingLanguage { ProgrammingLanguageId = 67, Name = "restructuredtext" },
                new ProgrammingLanguage { ProgrammingLanguageId = 68, Name = "ruby" },
                new ProgrammingLanguage { ProgrammingLanguageId = 69, Name = "rust" },
                new ProgrammingLanguage { ProgrammingLanguageId = 70, Name = "sb" },
                new ProgrammingLanguage { ProgrammingLanguageId = 71, Name = "scala" },
                new ProgrammingLanguage { ProgrammingLanguageId = 72, Name = "scheme" },
                new ProgrammingLanguage { ProgrammingLanguageId = 73, Name = "scss" },
                new ProgrammingLanguage { ProgrammingLanguageId = 74, Name = "shell" },
                new ProgrammingLanguage { ProgrammingLanguageId = 75, Name = "sol" },
                new ProgrammingLanguage { ProgrammingLanguageId = 76, Name = "aes" },
                new ProgrammingLanguage { ProgrammingLanguageId = 77, Name = "sparql" },
                new ProgrammingLanguage { ProgrammingLanguageId = 78, Name = "sql" },
                new ProgrammingLanguage { ProgrammingLanguageId = 79, Name = "st" },
                new ProgrammingLanguage { ProgrammingLanguageId = 80, Name = "swift" },
                new ProgrammingLanguage { ProgrammingLanguageId = 81, Name = "systemverilog" },
                new ProgrammingLanguage { ProgrammingLanguageId = 82, Name = "verilog" },
                new ProgrammingLanguage { ProgrammingLanguageId = 83, Name = "tcl" },
                new ProgrammingLanguage { ProgrammingLanguageId = 84, Name = "twig" },
                new ProgrammingLanguage { ProgrammingLanguageId = 85, Name = "typescript" },
                new ProgrammingLanguage { ProgrammingLanguageId = 86, Name = "vb" },
                new ProgrammingLanguage { ProgrammingLanguageId = 87, Name = "wgsl" },
                new ProgrammingLanguage { ProgrammingLanguageId = 88, Name = "xml" },
                new ProgrammingLanguage { ProgrammingLanguageId = 89, Name = "yaml" },
                new ProgrammingLanguage { ProgrammingLanguageId = 90, Name = "json" }
            );
    }
}