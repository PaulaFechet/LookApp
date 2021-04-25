import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { RecordModel } from '../models/record';
import { RecordRepositoryService } from '../repositories/record-repository.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  public records: BehaviorSubject<RecordModel[]>;

  constructor(private recordRepositoryService: RecordRepositoryService) {
    this.records = new BehaviorSubject<RecordModel[]>([]);
  }

  addRecord(recordModel: RecordModel): Observable<void> {
    return this.recordRepositoryService.addRecord(recordModel)
      .pipe(
        map(addedRecord => {
          this.records.next([...this.records.value, addedRecord]);
        })
      );
  }
}

