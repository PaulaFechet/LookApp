﻿using LookApp.API.Dtos;
using LookApp.Database.Models;

namespace LookApp.API.Mappers
{
    public interface ICategoryMapper
    {
        GetCategoryResponse mapToGetCategoryResponse(Category category);
        Category mapToCategory(CreateCategoryRequest createCategoryRequest);
    }
}