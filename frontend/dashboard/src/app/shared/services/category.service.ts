import { BehaviorSubject, Observable } from 'rxjs';
import { CategoryRepositoryService } from './../repositories/category-repository.service';
import { Injectable } from '@angular/core';
import { CategoryModel } from '../models/category';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categories: BehaviorSubject<CategoryModel[]>;

  constructor(private categoryRepositoryService: CategoryRepositoryService) {
    this.categories = new BehaviorSubject<CategoryModel[]>([]);
  }

  getById(categoryId: number): Observable<CategoryModel> {
    var category = this.categories.value.find(category => category.id === categoryId);
    if (category == undefined) {
      return this.categoryRepositoryService.getById(categoryId);
    }
    return of(category);
  }

  populateCategories(): Observable<Observable<CategoryModel[]>> {
    return this.categoryRepositoryService.getAllCategories()
      .pipe(
        map(categories => {
          this.categories.next(categories);
          return this.categories.asObservable();
        })
      );
  }

  addCategory(categoryModel: CategoryModel): Observable<void> {
    return this.categoryRepositoryService.addCategory(categoryModel)
      .pipe(
        map(addedCategory => {
          this.categories.next([...this.categories.value, addedCategory]);
        })
      );
  }

  deleteCategory(id: number): Observable<void> {
    return this.categoryRepositoryService.deleteCategory(id)
      .pipe(
        map(() => {
          var updatedCategories: CategoryModel[] = [];
          for (const category of this.categories.value) {
            if (category.id !== id) {
              updatedCategories.push(category);
            }
          }
          this.categories.next(updatedCategories);
        })
      );
  }
}
