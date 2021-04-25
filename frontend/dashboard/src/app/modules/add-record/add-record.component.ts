import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms'
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Validators } from "@angular/forms";
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.component.html',
  styleUrls: ['./add-record.component.scss']
})
export class AddRecordComponent implements OnInit {

  ngOnInit(): void {
  }

  productForm: FormGroup;
  data = [
    {
      "title": "Water",
      "description": "I want to be more aware of how much water I drink",
      "type": "numerical"
    },
    {
      "title": "Coffee",
      "description": "I want to be more aware of how much coffee I drink",
      "type": "numerical"
    }
  ]
  constructor(public dialogRef: MatDialogRef<AddRecordComponent>) {}

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    value: new FormControl(''),
  });


  entries() : FormArray {
    return this.productForm.get("entries") as FormArray
  }



  onSubmit() {
    console.log(this.productForm.value);
  }

  onClose() {
    console.log(this.form.value);
    this.dialogRef.close();
  }

}
