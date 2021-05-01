import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RecordModel } from './../../shared/models/record';
import { RecordService } from './../../shared/services/record.service';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.scss']
})
export class AddRecordComponent implements OnInit {
  public recordForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddRecordComponent>,
    private recordService: RecordService,
    @Inject(MAT_DIALOG_DATA) public id: number) { }

  ngOnInit(): void {
    this.recordForm = new FormGroup({
      date: new FormControl('', Validators.required),
      note: new FormControl(''),
      value: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (!this.recordForm.valid) {
      return;
    }

    const recordToAdd: RecordModel = this.recordForm.getRawValue();
    recordToAdd.categoryId = this.id;
    this.recordService.addRecord(recordToAdd).subscribe();
    this.onCloseMatDialog();
  }

  onCloseMatDialog() {
    console.log(this.recordForm.value);
    this.dialogRef.close();
  }
}
