using System;
using System.Collections.Generic;

#nullable disable

namespace LookApp.Database.Models
{
    public partial class Record
    {
        public string Id { get; set; }
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public int Value { get; set; }
        public int IdCategory { get; set; }

        public virtual Category IdCategoryNavigation { get; set; }
    }
}
