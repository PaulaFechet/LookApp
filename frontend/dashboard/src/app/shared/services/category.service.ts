import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endpoint: string = 'https://localhost:44387/api/categories';
  constructor(private http: HttpClient) { }


  getAllCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.endpoint}/allCategoryDetails`);
  }

  addCategory(categoryModel: CategoryModel): Observable<void> {
    return this.http.post<void>(`${this.endpoint}`, categoryModel);
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
