import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { numberRegEx } from 'src/app/shared/constants';
import { CategoryModel } from 'src/app/shared/models/category';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {

  public categoryForm: FormGroup;
  public categoryModel: CategoryModel;
  public categoryDetailsToDisplay: CategoryModel = new CategoryModel();
  public color: string = "";

  get categoryFormControls() {
    return this.categoryForm.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<UpdateCategoryComponent>,
    public formBuilder: FormBuilder,
    public categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public category: CategoryModel
  ) { }

  ngOnInit(): void {
    this.color = this.category.graphColor;

    this.categoryDetailsToDisplay = this.category;

    this.categoryForm = this.formBuilder.group({
      graphColor: [this.category.graphColor],
      title: [this.category.title, Validators.required],
      unitOfMeasure: [this.category.unitOfMeasure, Validators.required],
      lowerLimit: [this.category.lowerLimit, Validators.pattern(numberRegEx)],
      upperLimit: [this.category.upperLimit, Validators.pattern(numberRegEx)],
      description: [this.category.description]
    }, { validators: this.checkIfLimitsAreValid })
  }

  onClear(): void {
    this.categoryForm.reset()
  }

  onSubmit(categoryId: number): void {
    if (!this.categoryForm.valid) {
      return;
    }

    this.categoryForm.controls.graphColor.setValue(this.color);

    const categoryModel: CategoryModel = this.categoryForm.getRawValue();
    this.categoryService.updateCategory(categoryId, categoryModel).subscribe();

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
