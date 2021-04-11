using LookApp.Database.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LookApp.Business
{
    public class CategoryService : ICategoryService
    {
        private readonly LookAppContext _context;

        public CategoryService(LookAppContext dbContext)
        {
            this._context = dbContext;
        }

        public List<Category> GetCategories()
        {
            return _context.Categories.Include(c => c.Records).ToList();
        }

        public async Task<Category> GetCategoryByIdAsync(int id)
        {
            //return this.context.Categories.Where(x => x.Id == id).firstOneDefault();
            return await this._context.Categories.FindAsync(id);
        }

        public async Task CreateAsync(Category newCategory)
        {
            await this._context.Categories.AddAsync(newCategory);
            await this._context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Category categoryToDelete)
        {
            if (categoryToDelete != null)
            {
                this._context.Categories.Remove(categoryToDelete);
            }

            await this._context.SaveChangesAsync();
        }
    }
}
