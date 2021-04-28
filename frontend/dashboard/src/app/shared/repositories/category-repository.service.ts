import { CategoryModel } from './../models/category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryRepositoryService {

  private endpoint: string = 'https://localhost:44387/api/categories';

  constructor(private http: HttpClient) { }

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
