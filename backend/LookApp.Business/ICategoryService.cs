using LookApp.Database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LookApp.Business
{
    public interface ICategoryService
    {
        List<Category> GetCategories();
        Task<Category> GetCategoryByIdAsync(int id);
        Task CreateAsync(Category newCategory);

        Task DeleteAsync(Category categoryToDelete);
    }
}
