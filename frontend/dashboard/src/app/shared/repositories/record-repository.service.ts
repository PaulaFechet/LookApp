import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RecordModel } from '../models/record';

@Injectable({
  providedIn: 'root'
})
export class RecordRepositoryService {
  private endpoint: string = 'https://localhost:44387/api/records';

  constructor(private http: HttpClient) { }

  addRecord(recordModel: RecordModel): Observable<RecordModel> {
    return this.http.post<RecordModel>(`${this.endpoint}`, recordModel)
  }

  deleteRecord(id: number): Observable<void>{
    return this.http.delete<void>(`${this.endpoint}/${id}`)
  }

  getAllRecords(): Observable<RecordModel[]>{
    return this.http.get<RecordModel[]>(`${this.endpoint}/allRecordDetails`)
  }

  getRecordsByCategoryId(categoryId: number): Observable<RecordModel[]>{
    return this.http.get<RecordModel[]>(`${this.endpoint}/recordByCategoryId/${categoryId}`)
  }
}
