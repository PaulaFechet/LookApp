using System;
using System.Collections.Generic;

#nullable disable

namespace LookApp.Database.Models
{
    public partial class Category
    {
        public Category()
        {
            Records = new HashSet<Record>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }

        public virtual ICollection<Record> Records { get; set; }
    }
}
