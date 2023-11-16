using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Models;
using webapi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<CoderViewDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_";
    options.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<CoderViewDbContext>()
    .AddSignInManager<SignInManager<ApplicationUser>>()
    .AddRoles<IdentityRole>()
    .AddDefaultTokenProviders();
builder.Services.AddScoped<AuthService>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetService<CoderViewDbContext>();
    if (db.Database.EnsureCreated())
    {
        var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
        roleManager.CreateAsync(new IdentityRole("Administrator")).Wait();

        var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
        ApplicationUser user = new ApplicationUser();
        user.UserName = "admin";
        user.Email = "admin@admin.admin";
        userManager.CreateAsync(user, "Admin123!").Wait();
        userManager.AddToRoleAsync(user, "Administrator").Wait();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
