namespace LookApp.API.Dtos
{
    public class CreateCategoryRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string UnitOfMeasure { get; set; }
        public double? LowerLimit { get; set; }
        public double? UpperLimit { get; set; }
        public string? GraphColor { get; set; }
    }
}
