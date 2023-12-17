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
builder.Services.AddScoped<PostService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<UserService>();


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetService<CoderViewDbContext>();
    if (db.Database.EnsureCreated())
    {
        var context = scope.ServiceProvider.GetService<CoderViewDbContext>();
        var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
        roleManager.CreateAsync(new IdentityRole("Administrator")).Wait();

        var userManager = scope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
        ApplicationUser admin = new ApplicationUser();
        admin.UserName = "admin";
        admin.Email = "admin@gmail.com";
        userManager.CreateAsync(admin, "Admin123!").Wait();
        userManager.AddToRoleAsync(admin, "Administrator").Wait();

        ApplicationUser james = new ApplicationUser();
        james.UserName = "james";
        james.Email = "bond@gamil.com";
        userManager.CreateAsync(james, "Test123!").Wait();

        ApplicationUser arthur = new ApplicationUser();
        arthur.UserName = "arthur";
        arthur.Email = "arthur@outlook.com";
        userManager.CreateAsync(arthur, "Test123!").Wait();

        var post1 = new Post
        {
            Author = admin,
            Content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec finibus est eros, id rutrum quam sagittis et. Aenean orci neque, iaculis sit amet magna et, aliquam fermentum erat. Pellentesque vehicula posuere ante, eget sodales nisl suscipit et. Vestibulum efficitur arcu vel elit hendrerit viverra. Ut nec rhoncus nunc. Sed aliquam venenatis mauris, quis placerat mauris sodales nec. Suspendisse bibendum mi non purus sagittis fermentum. Sed bibendum erat ligula, a consequat mauris faucibus id. Pellentesque tristique tortor vel pellentesque commodo. Vivamus interdum lectus a purus hendrerit, sit amet semper metus mattis. Proin sollicitudin ac turpis eget mollis. Curabitur bibendum sed metus sed vehicula. Proin tincidunt vulputate tortor, quis lobortis urna cursus dictum. Integer nec orci a urna lobortis fermentum.",
            Title = "Lorem ipsum",
            Type = context.PostTypes.Find("discussion"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromDays(1),
        };
        context.Posts.Add(post1);

        var post2 = new Post
        {
            Author = admin,
            Content = "Sed vel molestie orci. Etiam eget libero mattis, viverra mauris et, imperdiet odio. Mauris ac tellus vel lacus egestas vehicula. Aenean feugiat, magna ac venenatis mollis, dolor felis tristique orci.\n\nSit amet vehicula ligula elit et ex. Vestibulum ut sagittis mauris. Proin accumsan fermentum imperdiet. Maecenas et placerat diam. Donec at sodales lorem. Aliquam vel quam vitae lectus congue ullamcorper vel in elit. Nam et vulputate risus. Maecenas orci enim, dignissim id augue at, eleifend lacinia orci. Fusce vitae erat eu mauris molestie vulputate. Proin nec mi vel turpis imperdiet dictum. Fusce blandit, nunc id dignissim pellentesque, enim purus venenatis dolor, sed rutrum lectus ex sit amet magna. Pellentesque in leo nec ligula mattis auctor.",
            Title = "Sed vel molestie",
            Type = context.PostTypes.Find("discussion"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromHours(3),
        };
        context.Posts.Add(post2);

        var post3 = new Post
        {
            Author = james,
            Content = "Donec et maximus nibh. Maecenas lacus nulla, tincidunt at felis nec, viverra posuere mauris?",
            Title = "Donec et",
            Type = context.PostTypes.Find("discussion"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromDays(72),
        };
        context.Posts.Add(post3);

        var post4 = new Post
        {
            Author = james,
            Content = "Fusce condimentum urna vitae tortor placerat maximus.\nDonec sollicitudin et tortor vitae efficitur. Duis non diam iaculis, fermentum turpis nec, dignissim tortor. Sed pellentesque finibus ante consequat aliquet. Cras ut facilisis nisi. Suspendisse potenti. Sed semper augue vel purus molestie vestibulum. Sed nunc mauris, tempus non pharetra ultrices, volutpat id mauris. Praesent nec odio sit amet sapien facilisis pellentesque in quis purus. Nulla bibendum ut mi egestas hendrerit. In non imperdiet nibh, bibendum volutpat neque. Nam eu metus sollicitudin, tempus magna non, commodo lectus.",
            Title = "Fusce condimentum",
            Type = context.PostTypes.Find("discussion"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromMinutes(5),
        };
        context.Posts.Add(post4);

        var post5 = new Post
        {
            Author = james,
            Content = "Donec pellentesque, ante at pellentesque lacinia, risus ex congue quam. Sit amet ultrices lacus eros non ex. Nulla sollicitudin fermentum orci, nec consequat odio tincidunt sed. Suspendisse eget libero et tortor elementum tempus. Proin eu purus gravida, rutrum neque quis, aliquam orci. Pellentesque sed diam quis tortor pellentesque finibus vel et ligula. Proin id massa eu ex varius blandit. Maecenas augue justo, interdum non tortor eu, maximus malesuada ligula. Interdum et malesuada fames ac ante ipsum primis in faucibus.",
            Title = "Pellentesque",
            Type = context.PostTypes.Find("discussion"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(7026),
        };
        context.Posts.Add(post5);

        var post6 = new Post
        {
            Author = james,
            Content = "Ut aliquet elit vel quam porttitor, vitae malesuada ante porttitor. Quisque finibus dolor fringilla molestie pharetra. Morbi quis est vitae neque sagittis dignissim. Curabitur a cursus dolor. Ut at justo lobortis, interdum massa sit amet, malesuada ante. Aliquam erat volutpat. Donec vulputate feugiat eros, ut volutpat nulla imperdiet vitae. Etiam luctus tincidunt diam, quis lobortis velit vehicula ac. Curabitur vulputate imperdiet nulla in scelerisque. Sed efficitur tristique interdum. Duis mollis ligula arcu, eu elementum nibh aliquet vitae. Donec eu enim ac metus ultricies maximus. Sed congue turpis orci, ut sollicitudin neque vestibulum ut. Sed ac imperdiet ipsum.",
            Title = "Aliquet?",
            Type = context.PostTypes.Find("discussion"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(1726),
        };
        context.Posts.Add(post6);

        var post7 = new Post
        {
            Author = arthur,
            Content = "Sed suscipit pharetra rutrum. Fusce facilisis bibendum nisl, id semper magna dictum nec. Aliquam erat volutpat. Praesent leo risus, malesuada ut viverra ut, condimentum scelerisque augue. Fusce ac ex risus. Sed posuere tortor ipsum, sit amet elementum ex ornare ullamcorper. In eget quam rhoncus, convallis leo sit amet, tincidunt sem. Proin vel malesuada neque. Integer aliquet felis ac urna finibus, ac placerat purus imperdiet. Duis consectetur elementum auctor. Nulla sit amet cursus ex. In hac habitasse platea dictumst.",
            Title = "Fusce facilisis bibendum nisl, id semper magna dictum nec.",
            Type = context.PostTypes.Find("discussion"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(2726),
        };
        context.Posts.Add(post7);

        var post8 = new Post
        {
            Author = james,
            Content = "def bubble_sort(arr):\r\n    n = len(arr)\r\n\r\n    # Traverse through all array elements\r\n    for i in range(n):\r\n        # Last i elements are already in place, so we don't need to check them\r\n        for j in range(0, n-i-1):\r\n            # Swap if the element found is greater than the next element\r\n            if arr[j] > arr[j+1]:\r\n                arr[j], arr[j+1] = arr[j+1], arr[j]",
            Title = "Bubble sort",
            Type = context.PostTypes.Find("snippet"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(526),
            ProgrammingLanguage = context.ProgrammingLanguages.Find(61)
        };
        context.Posts.Add(post8);

        var post9 = new Post
        {
            Author = admin,
            Content = "using System;\r\n\r\nclass Program\r\n{\r\n    static void Main()\r\n    {\r\n        Console.WriteLine(\"Hello, World!\");\r\n    }\r\n}",
            Title = "Hello world",
            Type = context.PostTypes.Find("snippet"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(3026),
            ProgrammingLanguage = context.ProgrammingLanguages.Find(12)
        };
        context.Posts.Add(post9);

        var post10 = new Post
        {
            Author = admin,
            Content = "[{\"title\":\"Mollis\",\"content\":\"Maecenas mollis magna dolor. Aliquam at risus nec nisi aliquet laoreet pharetra in nulla. Fusce nunc nunc, sollicitudin sed erat quis, volutpat scelerisque felis. Mauris ligula ex, viverra eget sollicitudin in, scelerisque id turpis. Mauris placerat, magna sit amet volutpat rutrum, ex augue vulputate urna, et dapibus nulla massa vitae diam. Nulla facilisi. Proin nibh ante, facilisis pretium lorem sed, euismod bibendum justo. Nam lacinia scelerisque sagittis.\"},{\"title\":\"Aenean \",\"content\":\"Aenean gravida erat ac neque aliquet ultricies. Pellentesque sit amet elementum neque. Integer eleifend ornare mattis. Integer euismod, nisl egestas faucibus mattis, risus tortor aliquam mi, id semper sem justo quis lacus. Sed tincidunt bibendum justo pulvinar varius. Maecenas elementum convallis ex, sit amet finibus orci accumsan et. Pellentesque dapibus varius enim at sodales. Aenean dignissim, risus non tincidunt tincidunt, dolor arcu sodales libero, sit amet dictum lorem est non purus. Pellentesque vulputate et lacus at molestie. Sed porta turpis et arcu condimentum dictum. Nunc volutpat orci metus, in facilisis tellus tincidunt ut. Morbi et massa massa. Suspendisse vel magna condimentum ligula lacinia congue eu at mi. Donec volutpat augue interdum, hendrerit risus non, consectetur enim. Donec ut diam ligula.\"},{\"title\":\"Sed sodales varius nisl, vitae venenatis quam egestas vel\",\"content\":\"Nunc ultrices, sem non tristique hendrerit, nunc neque tempus odio, non pellentesque massa lectus sit amet arcu. Quisque pellentesque odio non purus finibus, eu vestibulum tellus elementum. Pellentesque et quam aliquet, commodo ante ut, finibus quam. Fusce ut sem in justo vehicula consequat a sit amet arcu. Etiam quis molestie mauris, ac scelerisque erat. Suspendisse et accumsan ligula. In hac habitasse platea dictumst. Sed urna tellus, fringilla in augue eget, interdum tincidunt magna.\"},{\"title\":\"Morbi suscipit\",\"content\":\"Eu risus laoreet, nec semper mauris hendrerit. Sed ultricies, ipsum sit amet malesuada ultrices, mauris eros sollicitudin lectus, at bibendum ligula urna at libero. Nunc tincidunt pulvinar sapien vitae sagittis. Suspendisse ullamcorper id lacus ac pretium. Pellentesque eget interdum dolor. Nullam ac varius nibh, nec pellentesque nisl. Donec in ex id quam tincidunt ornare quis vel augue. Quisque egestas magna ipsum, in tristique ante finibus sit amet. Sed finibus odio nulla. Suspendisse tincidunt nisl nisi, a venenatis magna venenatis vitae. Aenean malesuada consequat lorem, lacinia dignissim justo tempus eu. Vivamus mi ante, finibus in libero at, mollis feugiat enim. Curabitur facilisis ullamcorper sollicitudin. Vestibulum hendrerit nisi eget nisi porta placerat.\"}]",
            Title = "Etiam venenatis",
            Type = context.PostTypes.Find("guide"),
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(1526),
            Description = "Ut libero dui, suscipit ac varius quis, facilisis id diam. Cras eget ipsum a sapien bibendum malesuada. Quisque non mattis sapien."
        };
        context.Posts.Add(post10);

        var tag1 = new Tag { Name = "Lorem" };
        var tag2 = new Tag { Name = "Cras eget" };
        var tag3 = new Tag { Name = "Quisque non" };
        var tag4 = new Tag { Name = "Maecenas mollis magna" };
        context.Tags.AddRange(tag1, tag2, tag3, tag4);
        context.TagToPost.Add(new TagToPost { Post = post1, Tag = tag1 });
        context.TagToPost.Add(new TagToPost { Post = post1, Tag = tag2 });
        context.TagToPost.Add(new TagToPost { Post = post1, Tag = tag3 });
        context.TagToPost.Add(new TagToPost { Post = post2, Tag = tag2 });
        context.TagToPost.Add(new TagToPost { Post = post5, Tag = tag2 });
        context.TagToPost.Add(new TagToPost { Post = post5, Tag = tag3 });
        context.TagToPost.Add(new TagToPost { Post = post7, Tag = tag1 });
        context.TagToPost.Add(new TagToPost { Post = post9, Tag = tag4 });

        var comment1 = new Comment
        {
            Post = post5,
            Author = admin,
            Content = "Vestibulum molestie",
            CreatedOn = DateTime.Now - TimeSpan.FromSeconds(4000)
        };
        context.Comments.Add(comment1);

        var comment2 = new Comment
        {
            Post = post5,
            Author = admin,
            ReplyTo = comment1,
            Content = "Nec mauris eu sollicitudin",
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(3800)
        };
        context.Comments.Add(comment2);

        var comment3 = new Comment
        {
            Post = post5,
            Author = james,
            ReplyTo = comment1,
            Content = "Maecenas tristique sem dignissim",
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(3700)
        };
        context.Comments.Add(comment3);

        var comment4 = new Comment
        {
            Post = post5,
            Author = james,
            Content = "Nunc mollis risus nec tellus consectetur ornare. Pellentesque sapien nibh, luctus sed mattis et, faucibus vitae enim. Suspendisse sit amet massa libero. Donec pulvinar leo nec lorem elementum, ut viverra felis viverra. Cras finibus nisl mattis euismod ullamcorper. Donec at posuere urna. Proin sollicitudin tristique odio, sed semper dolor sagittis et. Fusce leo velit, scelerisque a ligula sed, rhoncus lacinia velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc vitae lorem in tellus elementum consectetur. Vestibulum a blandit mauris. Proin facilisis non erat eget mattis. Praesent porttitor hendrerit posuere. Nulla congue arcu magna, in vulputate nunc facilisis non. Integer porttitor erat orci, tempor viverra erat ornare ac. Etiam id gravida nisi.",
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(5000)
        };
        context.Comments.Add(comment4);

        var comment5 = new Comment
        {
            Post = post5,
            Author = james,
            ReplyTo = comment3,
            Content = "Sed quis nisl nisi",
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(3100)
        };
        context.Comments.Add(comment5);

        var comment6 = new Comment
        {
            Post = post5,
            Author = james,
            Content = "Nunc est tellus",
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(6100)
        };
        context.Comments.Add(comment6);

        var comment7 = new Comment
        {
            Post = post5,
            Author = arthur,
            Content = "Luctus sed",
            CreatedOn = DateTime.UtcNow - TimeSpan.FromSeconds(6050)
        };
        context.Comments.Add(comment7);

        context.PostVotes.Add(new PostVote { Post = post1, User = james });
        context.PostVotes.Add(new PostVote { Post = post3, User = james });
        context.PostVotes.Add(new PostVote { Post = post4, User = james });
        context.PostVotes.Add(new PostVote { Post = post6, User = james });
        context.PostVotes.Add(new PostVote { Post = post7, User = james });
        context.PostVotes.Add(new PostVote { Post = post8, User = james });
        context.PostVotes.Add(new PostVote { Post = post10, User = james });
        context.PostVotes.Add(new PostVote { Post = post1, User = admin });
        context.PostVotes.Add(new PostVote { Post = post2, User = admin });
        context.PostVotes.Add(new PostVote { Post = post8, User = admin });
        context.PostVotes.Add(new PostVote { Post = post1, User = arthur });

        context.CommentVotes.Add(new CommentVote { Comment = comment1, User = arthur });
        context.CommentVotes.Add(new CommentVote { Comment = comment1, User = james });
        context.CommentVotes.Add(new CommentVote { Comment = comment1, User = admin });
        context.CommentVotes.Add(new CommentVote { Comment = comment4, User = admin });
        context.CommentVotes.Add(new CommentVote { Comment = comment2, User = arthur });
        context.CommentVotes.Add(new CommentVote { Comment = comment3, User = arthur });
        context.CommentVotes.Add(new CommentVote { Comment = comment5, User = james });
        context.CommentVotes.Add(new CommentVote { Comment = comment6, User = admin });
        context.CommentVotes.Add(new CommentVote { Comment = comment6, User = james });

        context.SaveChanges();
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
