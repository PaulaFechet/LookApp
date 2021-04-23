﻿using LookApp.Database.Models;
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

        public List<Category> GetCategories(int userId)
        {
            return _context.Categories
                .Where(c => c.CreatorId == userId)
                .Include(c => c.Records)
                .ToList();
        }

        public async Task<Category> GetCategoryByIdAsync(int id, int userId)
        {
            return await this._context.Categories.FirstOrDefaultAsync(c => c.Id == id && c.CreatorId == userId);
        }

        public async Task CreateAsync(Category newCategory)
        {
            await this._context.Categories.AddAsync(newCategory);
            await this._context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Category categoryToDelete)
        {
            if (categoryToDelete == null)
            {
                return;
            }

            this._context.Categories.Remove(categoryToDelete);
            await this._context.SaveChangesAsync();
        }
    }
}