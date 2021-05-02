import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryModel } from '../models/category';
import { CategoryRepositoryService } from './../repositories/category-repository.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly categories: BehaviorSubject<CategoryModel[]>;

  constructor(private categoryRepositoryService: CategoryRepositoryService) {
    this.categories = new BehaviorSubject<CategoryModel[]>([]);
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

  getById(categoryId: number): Observable<CategoryModel> {
    let category = this.categories.value.find(category => category.id === categoryId);
    if (!category) {
      return this.categoryRepositoryService.getById(categoryId);
    }
    return of(category);
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
          this.categories.next(this.categories.value.filter(c => c.id !== id));
        })
      );
  }

}
