using LookApp.API.Dtos;
using LookApp.Database.Models;

namespace LookApp.API.Mappers
{
    public class CategoryMapper : ICategoryMapper
    {
        public Category mapToCategory(CreateCategoryRequest createCategoryRequest)
        {
            return new Category
            {
                Id = 0,
                Title = createCategoryRequest.Title,
                Description = createCategoryRequest.Description,
                Type = createCategoryRequest.Type,
                Records = null
            };
        }

        public GetCategoryResponse mapToGetCategoryResponse(Category category)
        {
            return new GetCategoryResponse
            {
                Title = category.Title,
                Description = category.Description,
                Type = category.Type
            };
        }
    }
}
