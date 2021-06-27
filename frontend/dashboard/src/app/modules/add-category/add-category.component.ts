import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryModel } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';
import { numberRegEx } from './../../shared/constants';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  public categoryForm: FormGroup;
  public categoryModel: CategoryModel;

  public color: string = "";

  public selectedColor: string  = '';

  get categoryFormControls() {
    return this.categoryForm.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<AddCategoryComponent>,
    public formBuilder: FormBuilder,
    public categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      graphColor: [''],
      title: ['', Validators.required],
      unitOfMeasure: ['', Validators.required],
      lowerLimit: ['', Validators.pattern(numberRegEx)],
      upperLimit: ['', Validators.pattern(numberRegEx)],
      description: ['']
    }, { validators: this.checkIfLimitsAreValid })

  }

  onClear(): void {
    this.categoryForm.reset()

  }

  onSubmit(): void {
    if (!this.categoryForm.valid) {
      return;
    }

    this.categoryForm.controls.graphColor.setValue(this.color);
    console.log("color", this.color);

    const data: CategoryModel = this.categoryForm.getRawValue();
    console.log(data);
    this.categoryService.addCategory(data).subscribe();

    this.onClose();
  }

  onClose(): void {
    this.dialogRef.close();
  }

  checkIfLimitsAreValid(categoryForm: AbstractControl): ValidationErrors | null {

    let lowerLimitControl = categoryForm.get("lowerLimit");
    let upperLimitControl = categoryForm.get("upperLimit");

    if (lowerLimitControl.invalid ||
      upperLimitControl.invalid) {
      return null;
    }

    let lowerLimit = parseFloat(lowerLimitControl?.value);
    let upperLimit = parseFloat(upperLimitControl?.value);

    if (Number.isNaN(lowerLimit) ||
      Number.isNaN(upperLimit)) {
      return null;
    }

    if (lowerLimit < upperLimit) {
      return null;
    }

    return { invalidLimits: true };
  }
}
