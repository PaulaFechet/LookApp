using Microsoft.EntityFrameworkCore;

namespace LookApp.Database.Models
{
    public sealed class LookAppContext : DbContext
    {
        public LookAppContext(DbContextOptions<LookAppContext> options) : base(options)
        {
            Database.Migrate();
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Record> Records { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
