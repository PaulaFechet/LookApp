using System.Collections.Generic;

namespace LookApp.Database.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }

        public ICollection<Record> Records { get; set; }

        public int CreatorId { get; set; }
        public User Creator { get; set; }
    }
}
