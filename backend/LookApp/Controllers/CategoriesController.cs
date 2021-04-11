using LookApp.Business;
using LookApp.Database.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using LookApp.API.Mappers;
using System.Linq;
using LookApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace LookApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ICategoryMapper _categoryMapper;

        public CategoriesController(
            ICategoryService categoryService,
            ICategoryMapper categoryMapper)
        {
            this._categoryService = categoryService;
            this._categoryMapper = categoryMapper;
        }

        [HttpGet]
        public ActionResult<List<Category>> GetCategories()
        {
            var categories = _categoryService.GetCategories();
            var categoriesResponseList = categories.Select(c => _categoryMapper.mapToGetCategoryResponse(c));

            return Ok(categoriesResponseList);
        }

        [HttpGet("allCategoryDetails")]
        public ActionResult<List<Category>> GetAllInformationCategories()
        {
            var categories = _categoryService.GetCategories();

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> GetByIdAsync([FromRoute] int id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult> CreateAsync(CreateCategoryRequest createCategoryRequest)
        {
            var newCategory = _categoryMapper.mapToCategory(createCategoryRequest);
            await _categoryService.CreateAsync(newCategory);

            return Created(newCategory.Id.ToString(), null);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);
            await _categoryService.DeleteAsync(result);
            return NoContent();
        }
    }
}
