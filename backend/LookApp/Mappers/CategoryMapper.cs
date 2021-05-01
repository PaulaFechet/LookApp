using LookApp.API.Dtos;
using LookApp.Database.Models;

namespace LookApp.API.Mappers
{
    public class CategoryMapper : ICategoryMapper
    {
        public Category MapToCategory(CreateCategoryRequest createCategoryRequest, int creatorId)
        {
            return new Category
            {
                Id = 0,
                Title = createCategoryRequest.Title,
                Description = createCategoryRequest.Description,
                UnitOfMeasure = createCategoryRequest.UnitOfMeasure,
                LowerLimit = createCategoryRequest.LowerLimit,
                UpperLimit = createCategoryRequest.UpperLimit,
                CreatorId = creatorId,
                Records = null
            };
        }

        public GetCategoryResponse MapToGetCategoryResponse(Category category)
        {
            return new GetCategoryResponse
            {
                Title = category.Title,
                Description = category.Description,
                Type = category.UnitOfMeasure
            };
        }
    }
}
