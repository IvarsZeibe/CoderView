using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace webapi.Data;

public class CoderViewDbContext : IdentityDbContext
{
    public CoderViewDbContext(DbContextOptions options)
        : base(options)
    {
        Database.EnsureCreated();
        Database.Migrate();
    }
}