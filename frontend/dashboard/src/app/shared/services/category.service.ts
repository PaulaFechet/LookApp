import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from '../models/category'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endpoint: string = 'https://localhost:44387/api/categories';
  constructor(private http: HttpClient) { }


  getAllCategories() {
    return this.http.get<any>(`${this.endpoint}/allCategoryDetails`);
  }

  addCategory(categoryModel: CategoryModel) {
    return this.http.post<any>(`${this.endpoint}`, categoryModel);
  }

  deleteCategory(id: string) {
    return this.http.delete<any>(`${this.endpoint}/${id}`);
  }
}
