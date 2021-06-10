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
                GraphColor = createCategoryRequest.GraphColor,
                CreatorId = creatorId,
                Records = null
            };
        }

        public Category MapToUpdatedCategory(Category categoryToUpdate, UpdateCategoryRequest updatedCategory, int creatorId, int categoryId)
        {
            categoryToUpdate.Id = categoryId;
            categoryToUpdate.CreatorId = creatorId;
            categoryToUpdate.Title = updatedCategory.Title;
            categoryToUpdate.Description = updatedCategory.Description;
            categoryToUpdate.UnitOfMeasure = updatedCategory.UnitOfMeasure;
            categoryToUpdate.LowerLimit = updatedCategory.LowerLimit;
            categoryToUpdate.UpperLimit = updatedCategory.UpperLimit;
            categoryToUpdate.GraphColor = updatedCategory.GraphColor;
            return categoryToUpdate;
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
