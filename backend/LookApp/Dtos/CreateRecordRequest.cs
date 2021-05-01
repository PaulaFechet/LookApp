using System;

namespace LookApp.API.Dtos
{
    public class CreateRecordRequest
    {
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public double Value { get; set; }
        public int CategoryId { get; set; }
    }
}
