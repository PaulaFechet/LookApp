import { ValidationErrors } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { numberRegEx } from 'src/app/shared/constants';
import { CategoryModel } from 'src/app/shared/models/category';
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
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public category: CategoryModel) { }

  ngOnInit(): void {
    this.recordForm = this.formBuilder.group({
      date: ['', Validators.required],
      note: [''],
      value: ['', Validators.compose(
        [Validators.required, Validators.pattern(numberRegEx), this.checkIfInRangeWrapper()])
      ]
    });
  }

  onSubmit() {
    if (!this.recordForm.valid) {
      return;
    }

    const recordToAdd: RecordModel = this.recordForm.getRawValue();
    recordToAdd.categoryId = this.category.id;
    this.recordService.addRecord(recordToAdd).subscribe();
    this.onCloseMatDialog();
  }

  onCloseMatDialog() {
    this.dialogRef.close();
  }

  checkIfInRangeWrapper(): (recordForm: AbstractControl) => ValidationErrors | null {

    return (recordForm: AbstractControl): ValidationErrors | null => {
      var value = parseFloat(recordForm.value);

      if (Number.isNaN(value)) {
        return null;
      }

      if ((!this.category.lowerLimit || value > this.category.lowerLimit) &&
          (!this.category.upperLimit || value < this.category.upperLimit)) {
        return null;
      }

      return { notInRange: true };
    };
  }
}
