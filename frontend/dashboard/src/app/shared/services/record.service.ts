import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RecordModel } from '../models/record';
import { RecordRepositoryService } from '../repositories/record-repository.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  public recordsPerCategory: Map<number, BehaviorSubject<RecordModel[]>>;

  constructor(private recordRepositoryService: RecordRepositoryService) {
    this.recordsPerCategory = new Map<number, BehaviorSubject<RecordModel[]>>();
  }

  addRecord(recordModel: RecordModel): Observable<void> {
    return this.recordRepositoryService.addRecord(recordModel)
      .pipe(
        map(addedRecord => {
          var records = this.recordsPerCategory.get(recordModel.categoryId)
          records.next([...records.value, addedRecord]);
        })
      );
  }

  deleteRecord(categoryId: number, id: number): Observable<void> {
    return this.recordRepositoryService.deleteRecord(id)
      .pipe(
        map(() => {
          var records = this.recordsPerCategory.get(categoryId);
          records.next(records.value.filter(r => r.id !== id));
        })
      );
  }

  populateRecords(categoryId: number): Observable<BehaviorSubject<RecordModel[]>> {
    return this.recordRepositoryService.getRecordsByCategoryId(categoryId)
      .pipe(
        map(records => {
          var categoryRecords = new BehaviorSubject<RecordModel[]>(records);
          this.recordsPerCategory.set(categoryId, categoryRecords);
          return categoryRecords;
        })
      );
  }

  getRecordsByCategoryId(categoryId: number): Observable<BehaviorSubject<RecordModel[]>> {
    var records = this.recordsPerCategory.get(categoryId);
    if (records === undefined) {
      return this.populateRecords(categoryId);
    }

    return of(records);
  }
}
