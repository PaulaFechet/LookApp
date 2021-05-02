import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordModel } from '../models/record';
import { RecordRepositoryService } from '../repositories/record-repository.service';
import { SortedList } from './../helpers/sorted-list';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  private readonly recordsPerCategory: Map<number, BehaviorSubject<SortedList<RecordModel>>>;

  constructor(private readonly recordRepositoryService: RecordRepositoryService) {
    this.recordsPerCategory = new Map<number, BehaviorSubject<SortedList<RecordModel>>>();
  }

  addRecord(recordModel: RecordModel): Observable<void> {
    return this.recordRepositoryService.addRecord(recordModel)
      .pipe(
        map(addedRecord => {
          let records = this.recordsPerCategory.get(recordModel.categoryId)
          if (records) {
            let updatedRecords = SortedList.copy(records.value);
            updatedRecords.add(addedRecord);
            records.next(updatedRecords);
          }
        })
      );
  }

  deleteRecord(categoryId: number, id: number): Observable<void> {
    return this.recordRepositoryService.deleteRecord(id)
      .pipe(
        map(() => {
          let records = this.recordsPerCategory.get(categoryId);
          if (records) {
            let updatedRecords = SortedList.copy(records.value);
            updatedRecords.delete(r => r.id !== id);
            records.next(updatedRecords);
          }
        })
      );
  }

  populateRecords(categoryId: number): Observable<Observable<SortedList<RecordModel>>> {
    return this.recordRepositoryService.getRecordsByCategoryId(categoryId)
      .pipe(
        map(records => {
          let newRecords = new SortedList(records, this.compareRecordsByDate);
          let categoryRecords = new BehaviorSubject<SortedList<RecordModel>>(newRecords);
          this.recordsPerCategory.set(categoryId, categoryRecords);
          return categoryRecords.asObservable();
        })
      );
  }

  getRecordsByCategoryId(categoryId: number): Observable<Observable<SortedList<RecordModel>>> {
    let records = this.recordsPerCategory.get(categoryId);
    if (!records) {
      return this.populateRecords(categoryId);
    }
    return of(records);
  }

  compareRecordsByDate(a: RecordModel, b: RecordModel) {
    // convert date object into number to resolve issue in typescript
    return +new Date(a.date) - +new Date(b.date);
  }

}
