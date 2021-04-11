using LookApp.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LookApp.Business
{
    public interface ICategoryService
    {
        List<Category> GetCategories(int userId);
        Task<Category> GetCategoryByIdAsync(int id, int userId);
        Task CreateAsync(Category newCategory);
        Task DeleteAsync(Category categoryToDelete);
    }
}
