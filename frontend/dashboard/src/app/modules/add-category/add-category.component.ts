import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryModel } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  public categoryForm: FormGroup;
  public categoryModel: CategoryModel;

  constructor(
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    public formBuilder: FormBuilder,
    public categoryService: CategoryService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      title: ['', Validators.required],
      unitOfMeasure: ['', Validators.required],
      lowerLimit: [''],
      upperLimit: [''],
      description: ['', Validators.required]
    })
  }

  get f() {
    return this.categoryForm.controls;
  }

  onClear() {

  }

  onSubmit() {
    const data: CategoryModel = this.categoryForm.getRawValue();
    console.log(this.f.title.value, this.f.unitOfMeasure.value, this.f.description.value);

    this.categoryService.addCategory(data).subscribe();

    this.onClose();
  }

  onClose() {
    console.log(this.categoryForm.value);
    this.dialogRef.close();
  }
}
