using LookApp.Business;
using LookApp.Database.Models;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using LookApp.API.Mappers;
using System.Linq;
using System.Net;
using LookApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;

namespace LookApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ICategoryMapper _categoryMapper;

        private readonly int _currentUserId;

        public CategoriesController(
            ICategoryService categoryService,
            ICategoryMapper categoryMapper,
            IHttpContextAccessor httpContextAccessor)
        {
            this._categoryService = categoryService;
            this._categoryMapper = categoryMapper;

            this._currentUserId = int.Parse(httpContextAccessor.HttpContext.User.FindFirst("Id").Value);
        }

        [HttpGet]
        public ActionResult<List<GetCategoryResponse>> GetCategories()
        {
            var categories = _categoryService.GetCategories(this._currentUserId);
            var categoriesResponseList = categories.Select(c => _categoryMapper.MapToGetCategoryResponse(c));
            
            return Ok(categoriesResponseList);
        }

        [HttpGet("allCategoryDetails")]
        public ActionResult<List<Category>> GetAllInformationCategories()
        {
            var categories = _categoryService.GetCategories(this._currentUserId);
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetByIdAsync([FromRoute] int id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id, this._currentUserId);
            if (result == null)
            {
                return NotFound("There's no category with the provided id.");
            }

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Category>> CreateAsync(CreateCategoryRequest createCategoryRequest)
        {
            var categoryToAdd = _categoryMapper.MapToCategory(createCategoryRequest, this._currentUserId);
            var addedCategory = await _categoryService.CreateAsync(categoryToAdd);

            return Created(addedCategory.Id.ToString(), addedCategory);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync([FromRoute] int id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id, this._currentUserId);
            if (result == null)
            {
                return NotFound("There's no category with the provided id.");
            }

            await _categoryService.DeleteAsync(result);
            return NoContent();
        }
    }
}
