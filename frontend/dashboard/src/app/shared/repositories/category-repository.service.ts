import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from './../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService {

  private readonly endpoint: string = 'https://localhost:44387/api/categories';

  constructor(private readonly http: HttpClient) { }

  getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.endpoint}/allCategoryDetails`);
  }

  getById(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${this.endpoint}/${id}`);
  }

  addCategory(categoryModel: CategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(`${this.endpoint}`, categoryModel);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }

}
