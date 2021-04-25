import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}
