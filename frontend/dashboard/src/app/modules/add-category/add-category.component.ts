import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

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
  constructor(public dialogRef: MatDialogRef<AddCategoryComponent>) { }

  form: FormGroup = new FormGroup({
    $key: new FormControl(null),
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    type: new FormControl(''),
  });

  ngOnInit(): void {}

  onClear() {}

  onSubmit() {
    this.onClose();
  }

  onClose() {
    console.log(this.form.value);
    this.dialogRef.close();
  }



}
