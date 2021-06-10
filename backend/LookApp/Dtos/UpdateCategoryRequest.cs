using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LookApp.API.Dtos
{
    public class UpdateCategoryRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string UnitOfMeasure { get; set; }
        public double? LowerLimit { get; set; }
        public double? UpperLimit { get; set; }
        public string? GraphColor { get; set; }
    }
}
