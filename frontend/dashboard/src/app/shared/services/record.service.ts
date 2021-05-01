import { SortedList } from './../helpers/sorted-list';
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

  private recordsPerCategory: Map<number, BehaviorSubject<SortedList<RecordModel>>>;

  constructor(private recordRepositoryService: RecordRepositoryService) {
    this.recordsPerCategory = new Map<number, BehaviorSubject<SortedList<RecordModel>>>();
  }

  addRecord(recordModel: RecordModel): Observable<void> {
    return this.recordRepositoryService.addRecord(recordModel)
      .pipe(
        map(addedRecord => {
          var records = this.recordsPerCategory.get(recordModel.categoryId)
          if (records) {
            records.value.add(addedRecord);
            records.next(SortedList.copy(records.value));
          }
        })
      );
  }

  deleteRecord(categoryId: number, id: number): Observable<void> {
    return this.recordRepositoryService.deleteRecord(id)
      .pipe(
        map(() => {
          var records = this.recordsPerCategory.get(categoryId);
          records.value.delete(r => r.id !== id);
          records.next(SortedList.copy(records.value));
        })
      );
  }

  populateRecords(categoryId: number): Observable<Observable<SortedList<RecordModel>>> {
    return this.recordRepositoryService.getRecordsByCategoryId(categoryId)
      .pipe(
        map(records => {
          var newRecords = new SortedList(records, this.compareRecordsByDate);
          var categoryRecords = new BehaviorSubject<SortedList<RecordModel>>(newRecords);
          this.recordsPerCategory.set(categoryId, categoryRecords);
          return categoryRecords.asObservable();
        })
      );
  }

  getRecordsByCategoryId(categoryId: number): Observable<Observable<SortedList<RecordModel>>> {
    var records = this.recordsPerCategory.get(categoryId);
    if (records === undefined) {
      return this.populateRecords(categoryId);
    }

    return of(records);
  }

  compareRecordsByDate(a: RecordModel, b: RecordModel) {
    // convert date object into number to resolve issue in typescript
    return +new Date(a.date) - +new Date(b.date);
  }
}
