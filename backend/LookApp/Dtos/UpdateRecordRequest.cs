using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LookApp.API.Dtos
{
    public class UpdateRecordRequest
    {
        public DateTime Date { get; set; }
        public string Note { get; set; }
        public double Value { get; set; }
        public int CategoryId { get; set; }
    }
}
