import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { numberRegEx } from 'src/app/shared/constants';
import { CategoryModel } from 'src/app/shared/models/category';
import { RecordModel } from './../../shared/models/record';
import { RecordService } from './../../shared/services/record.service';
import * as moment from 'moment';

@Component({
  selector: 'app-update-record',
  templateUrl: './update-record.component.html',
  styleUrls: ['./update-record.component.scss']
})
export class UpdateRecordComponent implements OnInit {

  public recordForm: FormGroup;
  public record: RecordModel;
  public category: CategoryModel;

  constructor(
    private dialogRef: MatDialogRef<UpdateRecordComponent>,
    private recordService: RecordService,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public recordAndCategoryDetails: any) { }

  ngOnInit(): void {
    console.log(this.recordAndCategoryDetails);
    this.record = this.recordAndCategoryDetails[0];
    this.category = this.recordAndCategoryDetails[1];

    this.recordForm = this.formBuilder.group({
      date: [this.record.date, Validators.required],
      note: [this.record.note],
      value: [this.record.value, Validators.compose(
        [Validators.required, Validators.pattern(numberRegEx), this.checkIfInRangeWrapper()])
      ]
    });
  }

  onSubmit(recordId: number): void {

    if (!this.recordForm.valid) {
      return;
    }

    const recordToAdd: RecordModel = this.recordForm.getRawValue();
    recordToAdd.categoryId = this.category.id;
    this.recordService.updateRecord(recordId,recordToAdd).subscribe();
    this.onCloseMatDialog();
  }

  onCloseMatDialog(): void {
    this.dialogRef.close();
  }

  checkIfInRangeWrapper(): (recordForm: AbstractControl) => ValidationErrors | null {

    return (recordForm: AbstractControl): ValidationErrors | null => {
      let value = parseFloat(recordForm.value);

      if (Number.isNaN(value)) {
        return null;
      }

      if ((!this.category.lowerLimit || value >= this.category.lowerLimit) &&
        (!this.category.upperLimit || value <= this.category.upperLimit)) {
        return null;
      }

      return { notInRange: true };
    };
  }
}
