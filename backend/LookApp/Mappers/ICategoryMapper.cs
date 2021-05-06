using LookApp.API.Dtos;
using LookApp.Database.Models;

namespace LookApp.API.Mappers
{
    public interface ICategoryMapper
    {
        GetCategoryResponse MapToGetCategoryResponse(Category category);
        Category MapToCategory(CreateCategoryRequest createCategoryRequest, int creatorId);
        Category MapToUpdatedCategory(Category categoryToUpdate, UpdateCategoryRequest updatedCategory, int creatorId, int categoryId);
    }
}