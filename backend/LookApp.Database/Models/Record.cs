using System;

namespace LookApp.Database.Models
{
    public class Record
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public int Value { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }
    }
}
