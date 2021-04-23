import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {RecordModel} from '../models/record';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private endpoint: string = 'https://localhost:44387/api/records';
  constructor(private http: HttpClient) { }


  addRecord(recordModel: RecordModel){
    return this.http.post<any>(`${this.endpoint}`, recordModel)

  }
}
